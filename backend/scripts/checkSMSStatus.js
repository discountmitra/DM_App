require('dotenv').config();
const twilio = require('twilio');

async function checkSMSStatus() {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    console.log('🔍 Checking recent SMS messages...');
    
    // Get recent messages
    const messages = await client.messages.list({ limit: 10 });
    
    console.log('\n📱 Recent SMS Messages:');
    console.log('======================');
    
    messages.forEach((message, index) => {
      console.log(`\n${index + 1}. Message SID: ${message.sid}`);
      console.log(`   To: ${message.to}`);
      console.log(`   From: ${message.from}`);
      console.log(`   Status: ${message.status}`);
      console.log(`   Direction: ${message.direction}`);
      console.log(`   Date: ${message.dateCreated}`);
      console.log(`   Error Code: ${message.errorCode || 'None'}`);
      console.log(`   Error Message: ${message.errorMessage || 'None'}`);
      console.log(`   Price: ${message.price || 'N/A'}`);
      console.log(`   Body: ${message.body.substring(0, 100)}${message.body.length > 100 ? '...' : ''}`);
    });
    
    // Check specific message if provided
    const specificMessageId = 'SM88251fde0b9972e64e4b321e8c74658b';
    console.log(`\n🔍 Checking specific message: ${specificMessageId}`);
    
    try {
      const specificMessage = await client.messages(specificMessageId).fetch();
      console.log(`\n📋 Message Details:`);
      console.log(`   SID: ${specificMessage.sid}`);
      console.log(`   To: ${specificMessage.to}`);
      console.log(`   From: ${specificMessage.from}`);
      console.log(`   Status: ${specificMessage.status}`);
      console.log(`   Direction: ${specificMessage.direction}`);
      console.log(`   Date: ${specificMessage.dateCreated}`);
      console.log(`   Error Code: ${specificMessage.errorCode || 'None'}`);
      console.log(`   Error Message: ${specificMessage.errorMessage || 'None'}`);
      console.log(`   Price: ${specificMessage.price || 'N/A'}`);
      console.log(`   Body Length: ${specificMessage.body.length} characters`);
    } catch (error) {
      console.log(`❌ Could not fetch specific message: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking SMS status:', error.message);
  }
}

checkSMSStatus();
