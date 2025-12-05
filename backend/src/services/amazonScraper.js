const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');

function normalizeUrl(url) {
  if (!url) return '';
  url = url.trim().split('?')[0];
  if (url.startsWith('//')) url = 'https:' + url;
  const m = url.match(/\.(jpe?g|png|webp|gif)(?:$|\/)/i);
  return m ? url : '';
}

async function scrapeAmazonProduct(asin) {
  const url = `https://www.amazon.in/dp/${asin}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Referer": "https://www.google.com/",
  };

  let html;
  let source = 'LIVE';
  const cachePath = path.join(CACHE_DIR, `${asin}.json`);

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (e) {
    // Directory exists, continue
  }

  // Try to load cache first
  let cacheData = null;
  try {
    const cacheRaw = await fs.readFile(cachePath, 'utf8');
    cacheData = JSON.parse(cacheRaw);
  } catch (e) {
    // No cache, continue
  }

  // Helper to hash title+bullets
  function getHash(title, bullets) {
    const str = title + (bullets || []).join('|');
    let hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }

  // If cache exists and is fresh (<12h), use it
  if (cacheData && cacheData.timestamp && (Date.now() - cacheData.timestamp < 12 * 60 * 60 * 1000)) {
    source = 'CACHE';
    return cacheData.data;
  }

  // Otherwise, scrape live
  try {
    const response = await axios.get(url, { headers, timeout: 10000 });
    html = response.data;
  } catch (error) {
    // If live scrape fails, fallback to cache if available
    if (cacheData && cacheData.data) {
      source = 'CACHE';
      return cacheData.data;
    }
    throw new Error(`Failed to scrape ASIN ${asin}: ${error.message}`);
  }

  const $ = cheerio.load(html);

  const title = $('#productTitle').text().trim();
  
  const bullets = [];
  $('#feature-bullets .a-list-item').each((_, el) => {
    const text = $(el).text().trim();
    if (text) bullets.push(text);
  });

  const description = $('#productDescription').text().trim();

  let imageUrl = '';

  const metaImg = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content') ||
                  '';
  if (metaImg) {
    imageUrl = metaImg;
  }

  const selectorsToTry = [
    { sel: '#imgTagWrapperId img', attrs: ['data-old-hires','data-a-dynamic-image','data-src','src','data-srcset','srcset'] },
    { sel: '#landingImage', attrs: ['data-old-hires','data-a-dynamic-image','src','data-src'] },
    { sel: '#imageBlock_feature_div img', attrs: ['data-old-hires','data-a-dynamic-image','data-src','src'] },
    { sel: 'img[data-old-hires]', attrs: ['data-old-hires','src'] },
    { sel: '.a-dynamic-image', attrs: ['data-a-dynamic-image','src','data-src'] },
    { sel: 'img', attrs: ['data-src','src','srcset'] }
  ];

  for (const block of selectorsToTry) {
    if (imageUrl) break;
    const el = $(block.sel).first();
    if (!el || !el.length) continue;

    for (const attr of block.attrs) {
      let val = el.attr(attr) || '';
      if (!val && attr === 'srcset') {
        val = el.attr('srcset') || '';
        if (val) {
          const parts = val.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length) {
            val = parts[parts.length - 1].split(' ')[0];
          }
        }
      }

      if (!val) continue;

      if (attr === 'data-a-dynamic-image' || (val.startsWith('{') && val.includes('http'))) {
        try {
          let jsonText = val.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
          const parsed = JSON.parse(jsonText);
          const urls = Object.keys(parsed || {});
          if (urls.length) {
            urls.sort((a,b) => b.length - a.length);
            const candidate = normalizeUrl(urls[0]);
            if (candidate) { imageUrl = candidate; break; }
          }
        } catch (e) {
          // Continue to next attribute
        }
      }

      const candidate = normalizeUrl(val);
      if (candidate) { imageUrl = candidate; break; }
    }
  }

  if (!imageUrl) {
    const metaFallback = $('meta[property="og:image"]').attr('content') ||
                         $('meta[name="twitter:image"]').attr('content') || '';
    imageUrl = normalizeUrl(metaFallback);
  }
  
  if (!title && bullets.length === 0 && !description) {
    throw new Error(`Could not extract product details for ASIN ${asin} from ${source}`);
  }

  const result = { asin, title, bullets, description, imageUrl: imageUrl || null, source };

  // Save cache with timestamp and hash
  const cacheToSave = {
    timestamp: Date.now(),
    hash: getHash(title, bullets),
    data: result
  };
  try {
    await fs.writeFile(cachePath, JSON.stringify(cacheToSave), 'utf8');
  } catch (e) {
    // Ignore cache write errors
  }

  return result;
}

module.exports = { scrapeAmazonProduct };
