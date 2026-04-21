# FarmCity E-Commerce Platform 🌾

A complete e-commerce solution for premium rice products in Kenya, featuring M-Pesa and Card payments, real-time admin dashboard, Google Maps delivery tracking, and promotional offers system.

![FarmCity Platform](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

## 🚀 Live Demo

- **Frontend**: [https://farmcity.vercel.app](https://farmcity.vercel.app)
- **Backend API**: [https://api.farmcity.com](https://api.farmcity.com)
- **Admin Panel**: [https://farmcity.vercel.app/admin](https://farmcity.vercel.app/admin)

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog**: Browse premium rice varieties with detailed descriptions
- 🛒 **Shopping Cart**: Add, update, and remove items with real-time updates
- 💳 **Multiple Payment Options**: M-Pesa STK Push and Card payments via Stripe
- 📍 **Google Maps Integration**: Select delivery location visually
- 🎟️ **Promo Codes**: Apply discounts and special offers
- 📦 **Order Tracking**: Track order status from placement to delivery
- 👤 **User Profile**: Manage personal information and delivery addresses

### Admin Features
- 📊 **Dashboard Analytics**: Revenue, orders, and user statistics
- 📈 **Charts & Graphs**: Visual representation of business metrics
- 📋 **Order Management**: Update order and delivery status
- 👥 **User Management**: View customer information and order history
- 🗺️ **Geographic Analytics**: Orders by county
- 📢 **Advertisement System**: Create and manage promotional ads
- 🏷️ **Offers Management**: Create discount codes and special promotions

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Material-UI v7** - Professional component library
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Router** - Client-side navigation

### Backend
- **Spring Boot 3.5** - Java enterprise framework
- **PostgreSQL** - Production database
- **JWT** - Secure authentication
- **Spring Security** - Authorization and access control

### Third-Party Integrations
- **Stripe** - Card payment processing
- **M-Pesa Daraja API** - Mobile money payments
- **Google Maps API** - Location services

## 📦 Project Structure

```
farmcity/
├── src/                          # Backend source code
│   └── main/
│       ├── java/com/farmcity/
│       │   ├── config/          # Configuration classes
│       │   ├── controller/      # REST API controllers
│       │   ├── entity/           # Database entities
│       │   ├── repository/       # Data repositories
│       │   └── service/          # Business logic
│       └── resources/
│           ├── application.properties
│           └── application-prod.properties
├── farmcity-frontend/           # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React context providers
│   │   ├── api/                # API service functions
│   │   └── utils/              # Utility functions
│   └── public/                 # Static assets
├── CLIENT_PRESENTATION.md       # Client presentation
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
└── FINAL_DEPLOYMENT_GUIDE.md    # Comprehensive deployment guide
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+ (or use H2 for development)
- M-Pesa developer account (for payments)
- Stripe account (for card payments)
- Google Maps API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourorg/farmcity.git
   cd farmcity
   ```

2. **Setup Backend**:
   ```bash
   # Configure database
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   # Edit application.properties with your database credentials

   # Build and run
   ./mvnw spring-boot:run
   ```

3. **Setup Frontend**:
   ```bash
   cd farmcity-frontend
   npm install
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your API endpoints
   
   npm start
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Admin Panel: http://localhost:3000/admin

### Default Credentials
- **Admin User**: admin / admin123
- **Regular User**: Create via registration

## 🧪 Running Tests

```bash
# Backend tests
./mvnw test

# Frontend tests
cd farmcity-frontend
npm test
```

## 📱 Screenshots

### Customer Views
- **Homepage**: Featured products with promotional banners
- **Product Listing**: Grid view with filtering and sorting
- **Shopping Cart**: Cart management with promo code support
- **Checkout**: Payment selection and order confirmation
- **Order History**: Track past and current orders

### Admin Views
- **Dashboard**: Overview with statistics and charts
- **Order Management**: Update order status and view details
- **User Management**: View customers and their activity
- **Ads Management**: Create and manage advertisements
- **Offers Management**: Configure promotional codes

## 🌐 Deployment

See [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

### Quick Deploy
```bash
# Build for production
./mvnw clean package -P prod
cd farmcity-frontend && npm run build

# Deploy to your hosting platform
```

## 🔐 Environment Variables

### Backend
```properties
# Database
SUPABASE_DB_URL=jdbc:postgresql://...
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=***

# Security
JWT_SECRET_KEY=your-secret-key

# Payments
STRIPE_API_KEY=sk_live_...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...

# Maps
GOOGLE_MAPS_API_KEY=...
```

### Frontend
```env
REACT_APP_API_BASE_URL=https://api.your-domain.com
REACT_APP_GOOGLE_MAPS_API_KEY=...
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/update-profile` - Update user profile

### Products
- `GET /api/rice-products` - Get all products
- `GET /api/rice-products/{id}` - Get product by ID

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item

### Orders
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status` - Update order status

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/revenue` - Revenue data

### Ads & Offers
- `GET /api/ads/active` - Get active ads
- `GET /api/offers/active` - Get active offers
- `POST /api/offers/validate` - Validate promo code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized distribution is prohibited.

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Safaricom M-Pesa](https://developer.safaricom.co.ke/)
- [Stripe](https://stripe.com/)
- [Google Maps Platform](https://developers.google.com/maps)

## 📞 Support

For support, email support@farmcity.com or create an issue in the repository.

---

**Built with ❤️ for Kenyan Farmers**

Copyright © 2026 FarmCity. All rights reserved.
