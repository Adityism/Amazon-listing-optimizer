const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

require('./src/utils/initDb');

const optimizationRoutes = require('./src/routes/optimizationRoutes');
app.use('/api', optimizationRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
