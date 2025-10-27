# Discount Mitra

A comprehensive discount and service booking mobile application that connects users with various service providers across multiple categories.

## 🚀 Features

- **User Authentication**: Secure OTP-based login and registration
- **Service Categories**: Healthcare, Food & Dining, Beauty & Salon, Home Services, Construction, Events, Shopping
- **VIP Membership**: Premium subscription with exclusive discounts
- **Booking System**: Easy service booking and payment integration
- **Favorites**: Save preferred services and providers
- **Real-time Notifications**: SMS notifications for bookings and updates

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Context** for state management
- **AsyncStorage** for local data persistence

### Backend (API)
- **Node.js** with Express
- **Sequelize** ORM for database operations
- **PostgreSQL** (Neon Cloud) for data storage
- **JWT** for authentication
- **Twilio** for SMS notifications

### Infrastructure
- **Backend**: Deployed on Render
- **Database**: Neon Cloud PostgreSQL
- **SMS**: Twilio integration
- **CDN**: Cloudinary for image storage

## 📱 Production URLs

- **Backend API**: `https://discount-mitra-app.onrender.com`
- **Database**: Neon Cloud PostgreSQL
- **Health Check**: `https://discount-mitra-app.onrender.com/health`

## 🏗️ Project Structure

```
discount-mitra-backup-main/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── app.js          # Main server file
│   │   ├── db.js           # Database connection
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database seeding scripts
│   └── package.json
├── mobile/                  # React Native mobile app
│   ├── app/               # App screens and navigation
│   ├── assets/            # Images and icons
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants and data
│   ├── contexts/          # React Context providers
│   ├── services/          # API service functions
│   └── app.json           # Expo configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Expo CLI
- Expo Go app (for testing)

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

## 📊 Database Schema

The application uses the following main entities:
- **Users**: User accounts and authentication
- **Services**: Healthcare, restaurants, salons, etc.
- **Offers**: Discount offers for different user types
- **Bookings**: Service booking records
- **Favorites**: User's favorite services
- **VIP Subscriptions**: Premium membership data

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Mobile App
```typescript
export const BASE_URL = 'https://discount-mitra-app.onrender.com';
```

## 📱 Play Store Information

- **App Name**: Discount Mitra
- **Package Name**: `com.discountmitra.app`
- **Version**: 1.0.0
- **Bundle ID**: `com.discountmitra.app`

## 🔒 Security Features

- JWT-based authentication
- OTP verification for user registration/login
- Secure API endpoints with proper validation
- HTTPS communication
- Input sanitization and validation

## 📈 Performance Optimizations

- Database indexing for faster queries
- Image optimization with Cloudinary
- Efficient state management with React Context
- Lazy loading for better app performance
- Caching strategies for frequently accessed data

## 🚀 Deployment

### Backend
- Deployed on Render with automatic deployments from GitHub
- Environment variables configured in Render dashboard
- SSL certificates automatically managed

### Mobile App
- Built with Expo for easy deployment
- Ready for Play Store and App Store submission
- Production-ready configuration

## 📞 Support

For technical support or feature requests, please contact the development team.

## 📄 License

This project is licensed under the MIT License.

---

**Discount Mitra** - Your gateway to exclusive discounts and seamless service booking! 🎉
