# Lustril - Salon Booking Application

A production-ready multi-role salon appointment booking platform built with React Native.

## Features

### Client Features
- Browse nearby salons with location-based search
- View salon details with ratings and reviews
- Select multiple services
- Book appointments with time slot selection
- Online payment via Razorpay
- View booking history
- Rate and review salons
- Profile management

### Salon Owner Features
- Dashboard with earnings summary
- Add/edit/delete services
- Manage pricing and working hours
- Accept/reject bookings
- View daily appointments
- Staff management structure

### Admin Features
- Manage users and salons
- Approve salons
- View platform revenue
- Set commission percentage

## Tech Stack

- **Frontend**: React Native (Android)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Razorpay
- **Maps**: Google Maps API
- **Image Upload**: Cloudinary
- **UI**: NativeWind (Tailwind CSS)
- **Theme**: Luxury Gold + Dark UI

## Setup Instructions

### Prerequisites
- Node.js >= 18
- Android Studio
- JDK 11 or higher
- PostgreSQL

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Update `src/config/api.js` with your backend URL
- Add Google Maps API key in `android/app/src/main/AndroidManifest.xml`

3. Link native dependencies:
```bash
npx react-native link react-native-vector-icons
npx react-native link react-native-linear-gradient
```

4. Run the app:
```bash
npm run android
```

### Backend Setup

Navigate to the `backend` folder and follow the setup instructions in `backend/README.md`.

## Project Structure

```
app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── config/          # API and app configuration
│   ├── context/         # React Context (Auth)
│   ├── navigation/      # Navigation setup
│   ├── screens/         # App screens
│   │   ├── auth/       # Login, Signup
│   │   ├── client/     # Client screens
│   │   └── owner/      # Owner screens
│   ├── services/        # API service layers
│   ├── theme/          # Colors and theme
│   └── utils/          # Helper functions
├── android/            # Android native code
└── App.js             # Root component
```

## Key Features Implementation

### Authentication
- JWT-based authentication
- Role-based access control (Client, Salon Owner, Admin)
- Secure token storage with AsyncStorage

### Booking System
- Time slot conflict prevention
- Working hours validation
- Multiple service selection
- Real-time availability checking

### Payment Integration
- Razorpay payment gateway
- Payment verification
- Transaction history
- Refund handling

### Location Services
- Nearby salon discovery
- Distance calculation
- Google Maps integration
- Address geocoding

## Development

### Running in Development Mode
```bash
npm start
```

### Building for Production
```bash
cd android
./gradlew assembleRelease
```

## License

Private - All rights reserved
