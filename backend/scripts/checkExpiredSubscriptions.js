require('dotenv').config();
const { sequelize } = require('../src/db');
const { User } = require('../src/models/User');
const VipSubscription = require('../src/models/VipSubscription');

async function checkExpiredSubscriptions() {
  try {
    console.log('Checking for expired subscriptions...');
    
    const now = new Date();
    
    // Find users with expired VIP status
    const expiredUsers = await User.findAll({
      where: {
        isVip: true,
        vipExpiresAt: {
          [sequelize.Op.lt]: now
        }
      }
    });

    console.log(`Found ${expiredUsers.length} users with expired subscriptions`);

    let updatedCount = 0;
    for (const user of expiredUsers) {
      console.log(`Updating user ${user.id} (${user.name}) - subscription expired`);
      
      // Update user VIP status
      await user.update({
        isVip: false,
        vipExpiresAt: null,
        currentSubscriptionId: null
      });

      // Update subscription as expired
      if (user.currentSubscriptionId) {
        await VipSubscription.update(
          { 
            isActive: false,
            cancellationReason: 'Subscription expired'
          },
          { where: { id: user.currentSubscriptionId } }
        );
      }

      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} expired subscriptions`);
    
    if (updatedCount > 0) {
      console.log('Expired subscriptions have been processed');
    } else {
      console.log('No expired subscriptions found');
    }
    
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the check
checkExpiredSubscriptions();
