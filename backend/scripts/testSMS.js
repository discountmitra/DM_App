require('dotenv').config();
const smsService = require('../src/utils/smsService');

// Test SMS functionality
async function testSMS() {
  console.log('Testing SMS service...');
  
  // Mock booking data
  const mockBookingData = {
    id: 'test-booking-123',
    orderId: 'ORD-123456789',
    requestId: 'REQ-987654321',
    serviceName: 'Dr. John Smith - Cardiologist',
    serviceCategory: 'healthcare',
    amountPaid: 500.00,
    paymentStatus: 'completed',
    bookingDate: new Date(),
    orderData: {
      patientName: 'John Doe',
      patientAge: '35',
      patientGender: 'Male',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00 AM',
      symptoms: 'Chest pain and shortness of breath',
      preferredDoctor: 'Dr. John Smith',
      urgency: 'High',
      address: '123 Main Street, City',
      city: 'Mumbai',
      pincode: '400001',
      specialization: 'Cardiology',
      consultationType: 'In-person',
      medicalHistory: 'Hypertension, Diabetes',
      currentMedications: 'Metformin, Lisinopril',
      allergies: 'Penicillin',
      insuranceProvider: 'Health Plus Insurance',
      emergencyContact: '+919876543210',
      preferredLanguage: 'English',
      visitType: 'Consultation',
      department: 'Cardiology'
    },
    notes: 'Patient prefers morning appointments'
  };

  // Mock user data
  const mockUserData = {
    id: 123,
    newId: 'USR-ABC123',
    name: 'John Doe',
    phone: '+919876543210',
    email: 'john.doe@example.com',
    isVip: true
  };

  try {
    console.log('Sending test SMS notification...');
    const result = await smsService.sendBookingNotification(mockBookingData, mockUserData);
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ SMS failed:', result.error);
    }
  } catch (error) {
    console.error('❌ SMS test error:', error.message);
  }
}

// Test OTP SMS as well
async function testOTP() {
  console.log('\nTesting OTP SMS...');
  
  try {
    const result = await smsService.sendOTP('+919876543210', '1234');
    console.log('✅ OTP SMS sent successfully!');
    console.log('Message ID:', result.sid);
  } catch (error) {
    console.error('❌ OTP SMS failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🔧 SMS Service Test Suite');
  console.log('========================');
  
  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('❌ Twilio credentials not found in environment variables');
    console.log('Please set:');
    console.log('- TWILIO_ACCOUNT_SID');
    console.log('- TWILIO_AUTH_TOKEN');
    console.log('- TWILIO_PHONE_NUMBER');
    return;
  }
  
  console.log('✅ Twilio credentials found');
  console.log('From number:', process.env.TWILIO_PHONE_NUMBER);
  console.log('Management number: +917013110173');
  
  await testSMS();
  await testOTP();
  
  console.log('\n🏁 Test completed');
}

runTests().catch(console.error);
