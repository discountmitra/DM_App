require('dotenv').config();
const Faq = require('../src/models/Faq');
const { sequelize } = require('../src/db');

const faqData = [
  // Construction FAQs
  {
    category: 'construction',
    question: 'How do I request a construction quote?',
    answer: 'Enter your name, 10-digit mobile number, and any notes. Tap Request Now and our team will call you with the best quote.',
  },
  {
    category: 'construction',
    question: 'Do you provide on-site delivery?',
    answer: 'Yes, we provide on-site delivery for most materials and services. Delivery charges depend on distance and order volume.',
  },
  {
    category: 'construction',
    question: 'Can I get brand options and price lists?',
    answer: 'Absolutely. Share your requirement in the notes and we\'ll send available brands with current pricing for your location.',
  },

  // Events FAQs
  {
    category: 'events',
    question: 'How far in advance should I book my event?',
    answer: 'We recommend booking 2-4 weeks in advance for regular events and 6-8 weeks for wedding seasons or peak times to ensure availability.',
  },
  {
    category: 'events',
    question: 'What happens if I need to postpone my event?',
    answer: 'Events can be rescheduled up to 7 days before the event date without extra charges. Cancellations after this period may incur fees.',
  },
  {
    category: 'events',
    question: 'What is included in the event package?',
    answer: 'Our standard packages include venue decoration, basic lighting, sound system, and coordination. Additional services like catering and photography are available.',
  },

  // Salon FAQs
  {
    category: 'salon',
    question: 'How far in advance should I book an appointment?',
    answer: 'We recommend booking 2-3 days in advance for regular services and 1 week for special occasions to ensure your preferred time slot.',
  },
  {
    category: 'salon',
    question: 'What if I need to cancel or reschedule my appointment?',
    answer: 'You can cancel or reschedule up to 4 hours before your appointment time without any charges. Last-minute cancellations may incur a fee.',
  },
  {
    category: 'salon',
    question: 'What should I do to prepare for my appointment?',
    answer: 'Come with clean skin for facial services, avoid caffeine before treatments, and inform us of any allergies or skin sensitivities in advance.',
  },

  // Home Services FAQs
  {
    category: 'home-services',
    question: 'How quickly can a technician arrive?',
    answer: 'Our verified technicians can typically reach your location within 2-4 hours for urgent requests, or you can schedule a convenient time slot.',
  },
  {
    category: 'home-services',
    question: 'What if the technician cannot fix the issue?',
    answer: 'If the problem cannot be resolved, you won\'t be charged for the service. We also provide free re-visits if the same issue occurs within 7 days.',
  },
  {
    category: 'home-services',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, UPI, credit/debit cards, and digital wallets. Payment is required only after the service is completed to your satisfaction.',
  },
  {
    category: 'home-services',
    question: 'Do you provide warranty on repairs?',
    answer: 'Yes, we offer a 30-day service warranty on all repairs and replacements. Original manufacturer warranty applies to new parts and installations.',
  },

  // Healthcare FAQs
  {
    category: 'healthcare',
    question: 'How do I book an OP appointment?',
    answer: 'Fill in your details, choose a preferred date, and tap Book OP. You\'ll receive a unique booking code and our team will contact you to confirm the time. Pay the OP fee at the hospital counter as per your mode (Normal/VIP).',
  },
  {
    category: 'healthcare',
    question: 'What should I bring to the hospital?',
    answer: 'Carry a valid ID, previous medical reports/prescriptions, and your booking code shown on the success screen.',
  },
  {
    category: 'healthcare',
    question: 'Can I reschedule my appointment?',
    answer: 'Yes. You can contact the hospital reception using the number provided, and reschedule at least 6 hours before the appointment time.',
  },

  // Others FAQs
  {
    category: 'others',
    question: 'How does the custom service request work?',
    answer: 'Simply describe your service needs, location, and budget. Our team will find the best providers and get back to you with quotes within 24 hours.',
  },
  {
    category: 'others',
    question: 'What types of services can I request?',
    answer: 'You can request any service not covered in our main categories - from home repairs to personal assistance, professional services, and more.',
  },
  {
    category: 'others',
    question: 'How much does it cost to make a request?',
    answer: 'Normal users pay ₹9 per request, while VIP users get unlimited free requests. You only pay for the actual service, not our assistance.',
  },
  {
    category: 'others',
    question: 'How quickly will I get a response?',
    answer: 'We typically respond within 24 hours with provider options and quotes. Urgent requests may get faster responses.',
  },
];

async function seedFaq() {
  try {
    console.log('Starting FAQ seeding...');
    
    // Sync the model
    await Faq.sync({ force: true });
    console.log('FAQ table synced');

    // Insert FAQ data
    await Faq.bulkCreate(faqData);
    console.log(`Successfully seeded ${faqData.length} FAQ entries`);

    console.log('FAQ seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding FAQ data:', error);
  } finally {
    await sequelize.close();
  }
}

seedFaq();

