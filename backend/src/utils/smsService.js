const twilio = require('twilio');

class SMSService {
  constructor() {
    this.sid = process.env.TWILIO_ACCOUNT_SID;
    this.auth = process.env.TWILIO_AUTH_TOKEN;
    this.from = process.env.TWILIO_PHONE_NUMBER;
    this.managementNumber = '+918247556370'; // Management notification number
    
    if (!this.sid || !this.auth || !this.from) {
      console.warn('Twilio credentials not configured. SMS notifications will be disabled.');
      this.client = null;
    } else {
      this.client = twilio(this.sid, this.auth);
    }
  }

  /**
   * Send booking notification SMS to management
   * @param {Object} bookingData - The booking data from database
   * @param {Object} userData - The user data
   */
  async sendBookingNotification(bookingData, userData) {
    if (!this.client) {
      console.log('SMS service not configured, skipping notification');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const message = this.formatBookingNotification(bookingData, userData);
      
      const result = await this.client.messages.create({
        from: this.from,
        to: this.managementNumber,
        body: message
      });

      console.log('SMS notification sent successfully:', result.sid);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format booking notification message
   * @param {Object} bookingData - The booking data from database
   * @param {Object} userData - The user data
   */
  formatBookingNotification(bookingData, userData) {
    const {
      orderId,
      requestId,
      serviceName,
      serviceCategory,
      amountPaid,
      paymentStatus,
      bookingDate,
      orderData,
      notes
    } = bookingData;

    const {
      name,
      phone,
      email,
      isVip,
      newId
    } = userData;

    // Format booking date
    const bookingDateTime = new Date(bookingDate).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Extract relevant order data
    const orderDetails = this.extractOrderDetails(orderData, serviceCategory);

    let message = `DISCOUNT MITRA - NEW BOOKING\n`;
    message += `Order: ${orderId}\n`;
    message += `Service: ${serviceName}\n`;
    message += `User: ${name} (${phone})\n`;
    message += `Amount: Rs ${amountPaid}\n`;
    message += `Type: ${isVip ? 'VIP' : 'Normal'}\n`;
    message += `Check admin panel for details`;

    return message;
  }

  /**
   * Extract relevant details from orderData based on service category
   * @param {Object} orderData - The order data JSON
   * @param {String} serviceCategory - The service category
   */
  extractOrderDetails(orderData, serviceCategory) {
    if (!orderData || typeof orderData !== 'object') {
      return null;
    }

    let details = '';

    // Common fields that might be present
    const commonFields = [
      'patientName', 'patientAge', 'patientGender', 'appointmentDate', 
      'appointmentTime', 'symptoms', 'preferredDoctor', 'urgency',
      'address', 'city', 'pincode', 'specialization', 'consultationType'
    ];

    commonFields.forEach(field => {
      if (orderData[field]) {
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        details += `- ${label}: ${orderData[field]}\n`;
      }
    });

    // Category-specific fields
    if (serviceCategory === 'healthcare') {
      const healthFields = [
        'medicalHistory', 'currentMedications', 'allergies', 'insuranceProvider',
        'emergencyContact', 'preferredLanguage', 'visitType', 'department'
      ];
      
      healthFields.forEach(field => {
        if (orderData[field]) {
          const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          details += `- ${label}: ${orderData[field]}\n`;
        }
      });
    }

    return details || null;
  }

  /**
   * Send OTP SMS (existing functionality)
   * @param {String} phone - Phone number
   * @param {String} code - OTP code
   */
  async sendOTP(phone, code) {
    if (!this.client) {
      throw new Error('SMS service not configured');
    }

    const message = `Your DiscountMitra code is ${code}`;
    
    return await this.client.messages.create({
      from: this.from,
      to: phone,
      body: message
    });
  }
}

module.exports = new SMSService();
