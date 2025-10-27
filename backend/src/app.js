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
const authRouter = require('./routes/auth');
const subscriptionsRouter = require('./routes/subscriptions');
const bookingsRouter = require('./routes/bookings');
const billPaymentsRouter = require('./routes/billPayments');
const favoritesRouter = require('./routes/favorites');

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
app.use('/auth', authRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/bookings', bookingsRouter);
app.use('/bill-payments', billPaymentsRouter);
app.use('/favorites', favoritesRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    // Auto-create tables if not present
    await sequelize.sync();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();


