require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db');
const eventsRouter = require('./routes/events');
const constructionRouter = require('./routes/construction');
const healthcareRouter = require('./routes/healthcare');
const homeServicesRouter = require('./routes/homeServices');
const restaurantsRouter = require('./routes/restaurants');
const salonsRouter = require('./routes/salons');
const shoppingRouter = require('./routes/shopping');
const faqRouter = require('./routes/faq');
const assetsRouter = require('./routes/assets');
const offersRouter = require('./routes/offers');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/events', eventsRouter);
app.use('/construction', constructionRouter);
app.use('/healthcare', healthcareRouter);
app.use('/home-services', homeServicesRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/salons', salonsRouter);
app.use('/shopping', shoppingRouter);
app.use('/faq', faqRouter);
app.use('/assets', assetsRouter);
app.use('/offers', offersRouter);

const PORT = process.env.PORT ;

async function start() {
  try {
    await sequelize.authenticate();
    // Auto-create tables if not present
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();


