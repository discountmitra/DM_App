require('dotenv').config();
const twilio = require('twilio');

async function testSimpleSMS() {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    console.log('Testing simple SMS...');
    
    // Test 1: Very simple message
    console.log('\n1. Testing very simple message...');
    const result1 = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+917013110173',
      body: 'Test message from Discount Mitra'
    });
    console.log('✅ Simple message sent:', result1.sid);
    
    // Test 2: Message with basic formatting
    console.log('\n2. Testing formatted message...');
    const result2 = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+917013110173',
      body: 'DISCOUNT MITRA\nNew booking received\nOrder: TEST123\nAmount: Rs 500'
    });
    console.log('✅ Formatted message sent:', result2.sid);
    
    // Test 3: Check message length
    const longMessage = 'DISCOUNT MITRA - NEW BOOKING NOTIFICATION\n\nBOOKING DETAILS:\n- Order ID: ORD-123456789\n- Request ID: REQ-987654321\n- Service: Dr. John Smith - Cardiologist\n- Category: healthcare\n- Amount: Rs 500\n- Payment: COMPLETED\n- Date: 15/01/2024, 10:00 AM\n\nUSER DETAILS:\n- Name: John Doe\n- Phone: +919876543210\n- Email: john.doe@example.com\n- User ID: USR-ABC123\n- Type: VIP\n\nBOOKING INFORMATION:\n- Patient Name: John Doe\n- Patient Age: 35\n- Symptoms: Chest pain\n- Appointment Date: 2024-01-15\n\nNOTES: Healthcare booking\n\nThis booking requires immediate attention.\nCheck admin panel for full details.';
    
    console.log('\n3. Testing long message...');
    console.log('Message length:', longMessage.length, 'characters');
    
    const result3 = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+917013110173',
      body: longMessage
    });
    console.log('✅ Long message sent:', result3.sid);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
  }
}

testSimpleSMS();
