require('dotenv').config();
const { sequelize } = require('../src/db');
const { QueryTypes } = require('sequelize');

async function migrateUserTable() {
  try {
    console.log('Starting user table migration...');
    
    // Add new columns to users table
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "vipExpiresAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "currentSubscriptionId" INTEGER;
    `, { type: QueryTypes.RAW });
    
    console.log('User table migration completed successfully');
    
    // Create vip_subscriptions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS vip_subscriptions (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id),
        "planId" VARCHAR(255) NOT NULL,
        "planName" VARCHAR(255) NOT NULL,
        "amountPaid" DECIMAL(10,2) NOT NULL,
        "originalPrice" DECIMAL(10,2) NOT NULL,
        "discountApplied" DECIMAL(5,2) DEFAULT 0,
        "couponCode" VARCHAR(255),
        "subscriptionStart" TIMESTAMP NOT NULL DEFAULT NOW(),
        "subscriptionEnd" TIMESTAMP NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "cancelledAt" TIMESTAMP,
        "cancellationReason" VARCHAR(255),
        "paymentMethod" VARCHAR(255) DEFAULT 'demo',
        "paymentStatus" VARCHAR(255) DEFAULT 'completed',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `, { type: QueryTypes.RAW });
    
    console.log('Vip subscriptions table created successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

migrateUserTable();
