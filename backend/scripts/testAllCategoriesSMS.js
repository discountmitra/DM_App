require('dotenv').config();
const smsService = require('../src/utils/smsService');

// Test SMS functionality for all categories
async function testAllCategoriesSMS() {
  console.log('🔧 Testing SMS for All Categories');
  console.log('==================================');
  
  const categories = [
    'healthcare',
    'home-services', 
    'construction',
    'events',
    'beauty-salon',
    'dine-out'
  ];
  
  const excludedCategories = ['food', 'shopping'];
  
  for (const category of categories) {
    console.log(`\n📱 Testing ${category.toUpperCase()} category...`);
    
    // Mock booking data for each category
    const mockBookingData = {
      id: `test-${category}-123`,
      orderId: `ORD-${category.toUpperCase()}-123456`,
      requestId: `REQ-${category.toUpperCase()}-789`,
      serviceName: getServiceNameForCategory(category),
      serviceCategory: category,
      amountPaid: getAmountForCategory(category),
      paymentStatus: 'completed',
      bookingDate: new Date(),
      orderData: getOrderDataForCategory(category),
      notes: `Test booking for ${category} category`
    };

    // Mock user data
    const mockUserData = {
      id: 123,
      newId: 'USR-TEST123',
      name: 'Test User',
      phone: '+919876543210',
      email: 'test@example.com',
      isVip: false
    };

    try {
      const result = await smsService.sendBookingNotification(mockBookingData, mockUserData);
      
      if (result.success) {
        console.log(`✅ SMS sent successfully for ${category}`);
        console.log(`   Message ID: ${result.messageId}`);
      } else {
        console.log(`❌ SMS failed for ${category}: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error testing ${category}: ${error.message}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test excluded categories (should not send SMS)
  console.log(`\n🚫 Testing EXCLUDED categories (should not send SMS)...`);
  for (const category of excludedCategories) {
    console.log(`\n📱 Testing ${category.toUpperCase()} category (should be excluded)...`);
    
    const mockBookingData = {
      id: `test-${category}-123`,
      orderId: `ORD-${category.toUpperCase()}-123456`,
      requestId: `REQ-${category.toUpperCase()}-789`,
      serviceName: getServiceNameForCategory(category),
      serviceCategory: category,
      amountPaid: getAmountForCategory(category),
      paymentStatus: 'completed',
      bookingDate: new Date(),
      orderData: getOrderDataForCategory(category),
      notes: `Test booking for ${category} category`
    };

    const mockUserData = {
      id: 123,
      newId: 'USR-TEST123',
      name: 'Test User',
      phone: '+919876543210',
      email: 'test@example.com',
      isVip: false
    };

    // Check if category should be excluded
    const shouldSendSMS = !excludedCategories.includes(category.toLowerCase());
    console.log(`   Should send SMS: ${shouldSendSMS} (${shouldSendSMS ? '❌ ERROR' : '✅ CORRECT'})`);
  }
  
  console.log('\n🏁 All category tests completed');
}

function getServiceNameForCategory(category) {
  const serviceNames = {
    'healthcare': 'Dr. John Smith - Cardiologist',
    'home-services': 'Plumbing Service - Emergency Repair',
    'construction': 'Brick Supply - Red Bricks',
    'events': 'Wedding Photography Package',
    'beauty-salon': 'Hair Cut & Styling Service',
    'dine-out': 'Restaurant Reservation - Table for 4',
    'food': 'Pizza Delivery - Margherita',
    'shopping': 'Electronics - Smartphone'
  };
  return serviceNames[category] || `${category} Service`;
}

function getAmountForCategory(category) {
  const amounts = {
    'healthcare': 500,
    'home-services': 300,
    'construction': 1500,
    'events': 2000,
    'beauty-salon': 200,
    'dine-out': 800,
    'food': 150,
    'shopping': 25000
  };
  return amounts[category] || 100;
}

function getOrderDataForCategory(category) {
  const baseData = {
    userName: 'Test User',
    userPhone: '+919876543210',
    address: '123 Test Street, Test City',
    preferredTime: '10:00 AM',
    issueNotes: 'Test booking for SMS functionality'
  };

  const categorySpecificData = {
    'healthcare': {
      ...baseData,
      patientName: 'Test Patient',
      patientAge: '30',
      symptoms: 'Test symptoms',
      appointmentDate: '2024-01-15'
    },
    'home-services': {
      ...baseData,
      serviceType: 'Plumbing',
      urgency: 'High',
      preferredDate: '2024-01-15'
    },
    'construction': {
      ...baseData,
      materialType: 'Bricks',
      quantity: '1000',
      deliveryAddress: 'Construction Site'
    },
    'events': {
      ...baseData,
      eventType: 'Wedding',
      eventDate: '2024-02-14',
      venue: 'Grand Hotel',
      guestCount: '100'
    },
    'beauty-salon': {
      ...baseData,
      serviceType: 'Hair Cut',
      preferredStylist: 'Any',
      appointmentDate: '2024-01-15'
    },
    'dine-out': {
      ...baseData,
      restaurantName: 'Test Restaurant',
      partySize: '4',
      specialRequests: 'Window table'
    },
    'food': {
      ...baseData,
      itemName: 'Pizza Margherita',
      quantity: '2',
      deliveryAddress: '123 Test Street'
    },
    'shopping': {
      ...baseData,
      productName: 'Smartphone',
      brand: 'Test Brand',
      model: 'Test Model'
    }
  };

  return categorySpecificData[category] || baseData;
}

// Run the test
testAllCategoriesSMS().catch(console.error);
