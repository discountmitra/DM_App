# Discount Mitra

A comprehensive mobile application with backend API for discovering and booking various services with exclusive discounts for normal and VIP users.

## 🚀 Features

- **Multi-Category Services**: Healthcare, Home Services, Events, Construction, Food, Shopping, Beauty
- **Dual User System**: Normal users and VIP subscribers with different discount tiers
- **Real-time Data**: Dynamic content fetched from PostgreSQL database
- **Offers & Benefits**: Service-specific offers for each category
- **FAQ System**: Category-wise frequently asked questions
- **Asset Management**: Dynamic images, deals, and promotional content

## 🏗️ Architecture

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **State Management**: React Context API
- **Navigation**: Expo Router

## 📱 Mobile App Structure

```
mobile/
├── app/                    # Screen components
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── *.tsx              # Individual screens
├── components/             # Reusable components
├── constants/              # Static data and configuration
├── contexts/               # React Context providers
└── assets/                 # Images and static assets
```

## 🖥️ Backend Structure

```
backend/
├── src/
│   ├── models/             # Sequelize database models
│   ├── routes/             # Express API routes
│   ├── db.js              # Database configuration
│   └── app.js             # Main application file
├── scripts/                # Database seeding scripts
└── package.json           # Dependencies and scripts
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd discount-mitra-backup-main
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Update `.env` with your database credentials:
```env
PGDATABASE=dm_app
PGUSER=postgres
PGPASSWORD=your_secure_password_here
PGHOST=localhost
PGPORT=5432
PORT=4000
NODE_ENV=development
```

#### Database Setup

1. Create the PostgreSQL database:
```sql
CREATE DATABASE dm_app;
```

2. Run the application to auto-create tables:
```bash
npm start
```

3. Seed the database with initial data:
```bash
# Seed all data
npm run seed:construction
npm run seed:healthcare
npm run seed:home-services
npm run seed:restaurants
npm run seed:shopping
npm run seed:salons
npm run seed:faq
npm run seed:assets
npm run seed:offers
```

### 3. Mobile App Setup

```bash
cd mobile
npm install
```

#### Environment Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Update `.env` with your API URL:
```env
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_APP_NAME=Discount Mitra
EXPO_PUBLIC_APP_VERSION=1.0.0
```

#### Development

1. Start the Expo development server:
```bash
npm start
```

2. Scan the QR code with Expo Go app on your mobile device

## 📊 Database Schema

### Core Tables

- **Events**: Event services and details
- **Construction**: Construction materials and services
- **Healthcare**: Hospitals, clinics, and medical services
- **HomeServices**: Home maintenance and repair services
- **Restaurants**: Food establishments and dining options
- **Shopping**: Shopping malls and retail stores
- **Salons**: Beauty and wellness services
- **FAQ**: Frequently asked questions by category
- **Assets**: Images, deals, and promotional content
- **Offers**: Service-specific offers for normal and VIP users

## 🔧 API Endpoints

### Base URL
```
http://localhost:4000
```

### Available Endpoints

- `GET /health` - Health check
- `GET /events` - List all events
- `GET /construction` - List construction services
- `GET /healthcare` - List healthcare providers
- `GET /home-services` - List home services
- `GET /restaurants` - List restaurants
- `GET /shopping` - List shopping items
- `GET /salons` - List salon services
- `GET /faq/:category` - Get FAQ by category
- `GET /assets/:type` - Get assets by type
- `GET /offers/category/:category` - Get offers by category

## 🎨 Key Features

### User Modes
- **Normal Users**: Standard discounts and services
- **VIP Users**: Enhanced discounts and premium features

### Service Categories
1. **Healthcare**: Hospitals, diagnostics, pharmacy, dental, eye care
2. **Home Services**: Repairs, cleaning, security systems
3. **Events**: Decoration, DJ services, catering, venues
4. **Construction**: Materials, interior design, labor services
5. **Food**: Restaurants, dining, food delivery
6. **Shopping**: Malls, retail stores, fashion outlets
7. **Beauty**: Hair salons, spas, beauty treatments

### Dynamic Content
- Real-time data from database
- Category-specific offers and benefits
- Dynamic FAQ system
- Asset management for images and deals

## 🔒 Security Features

- Environment variable configuration
- No hardcoded credentials
- Secure API endpoints
- Input validation and error handling

## 🚀 Deployment

### Backend Deployment

1. Set up production environment variables
2. Configure PostgreSQL database
3. Run database migrations
4. Start the server with PM2 or similar process manager

### Mobile App Deployment

1. Configure production API URLs
2. Build the app with Expo:
```bash
expo build:android
expo build:ios
```
3. Deploy to app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the FAQ section in the app
- Review the API documentation

## 🔄 Version History

- **v1.0.0** - Initial release with all core features
- Database migration from static data to dynamic content
- Multi-category service support
- VIP subscription system
- Real-time offers and benefits

---

**Note**: This application is designed for demonstration purposes. In production, implement proper authentication, payment processing, and security measures.
