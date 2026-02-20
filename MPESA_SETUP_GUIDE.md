# 🚀 Farmcity M-Pesa Payment Integration - Complete Setup Guide

## 🎯 Overview

This project now includes full M-Pesa Daraja API integration for secure mobile payments. Both frontend and backend are configured for testing M-Pesa payments.

## 📋 Prerequisites

### 1. Safaricom Developer Account Setup

1. **Visit**: <https://developer.safaricom.co.ke/>
2. **Create Account**: Register for a developer account
3. **Create App**: Create a new application to get credentials
4. **Get Credentials**: Note down your:

- **Consumer Key**: Hu2Ziq60wttgf2fIrGAyr5kMyFzCKG4yR1PSSNv3dTIxkaOc
  - **Consumer Secret**: 9GtoKEGDRSG0vTPchK3zy3oJt6hUfKxRxlMgUPsxW8Qtz1Q4GqUK8X0rasAjCUDO
  - Passkey (for sandbox: `SHUyWmlxNjB3dHRnZjJmSXJHQXlyNWtNeUZ6Q0tHNHlSMVBTU052M2RUSXhrYU9jOjlHdG9LRUdEUlNHMHZUUGNoSzN6eTNvSnQ2aFVmS3hSeGxNZ1VQc3hXOFF0ejFRNEdxVUs4WDByYXNBakNVRE8`)
- Shortcode (for sandbox: `174379`)

### 2. Configure M-Pesa Credentials

Update `src/main/resources/application.properties`:

```properties
# M-Pesa Configuration
mpesa.consumer-key=Hu2Ziq60wttgf2fIrGAyr5kMyFzCKG4yR1PSSNv3dTIxkaOc
mpesa.consumer-secret=9GtoKEGDRSG0vTPchK3zy3oJt6hUfKxRxlMgUPsxW8Qtz1Q4GqUK8X0rasAjCUDO
mpesa.shortcode=174379
mpesa.passkey=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
mpesa.callback-url=http://localhost:8080/api/mpesa/callback
mpesa.environment=sandbox
mpesa.base-url=https://sandbox.safaricom.co.ke
```

## 🏃‍♂️ Running the Application

### 1. Start Backend (Port 8080)

```powershell
cd c:\Users\user\Desktop\thirtysixfarms
mvn spring-boot:run
```

### 2. Start Frontend (Port 3000)

```powershell
cd c:\Users\user\Desktop\thirtysixfarms\farmcity-frontend
npm start
```

### 3. Access Application

- **Frontend**: <http://localhost:3000>
- **Backend APIs**: <http://localhost:8080>
- **H2 Database Console**: <http://localhost:8080/h2-console>

## 🧪 Testing M-Pesa Payment

### Frontend Testing Flow

1. **Browse Products**: Go to <http://localhost:3000>
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click "Cart" in navigation
4. **Initiate Payment**: Click "💳 Pay with M-Pesa"
5. **Enter Phone**: Use test number format: `0712345678` or `254712345678`
6. **Process Payment**: Click "Pay with M-Pesa"

### Test Phone Numbers (Sandbox)

- `254708374149` - Success
- `254708374150` - Insufficient Balance
- `254708374151` - Wrong PIN
- `254708374152` - Invalid Account

### Backend API Testing

#### 1. Test Token Generation

```powershell
curl -X GET http://localhost:8080/api/mpesa/token
```

#### 2. Test STK Push

```powershell
curl -X POST http://localhost:8080/api/mpesa/stkpush `
  -H "Content-Type: application/json" `
  -d '{
    "phone": "254708374149",
    "amount": 100,
    "reference": "TEST_ORDER_123",
    "description": "Test Payment"
  }'
```

#### 3. Check Payment Status

```powershell
curl -X GET http://localhost:8080/api/mpesa/status/{CheckoutRequestID}
```

## 🔧 Key Features Implemented

### Backend (Spring Boot)

- **MpesaController**: Handles all M-Pesa API endpoints
- **MpesaService**: Business logic for token generation, STK push, callbacks
- **MpesaConfig**: Configuration management
- **Database Integration**: Stores transaction records and order status
- **CORS Support**: Enables frontend communication

### Frontend (React)

- **MpesaPayment Component**: Beautiful, animated payment interface
- **Cart Integration**: Seamless shopping cart to payment flow
- **Real-time Status**: Live payment status updates
- **Error Handling**: Graceful failure management
- **Phone Number Formatting**: Auto-formats to international format

### Security Features

- **Secure Token Management**: Automatic access token generation
- **Callback Verification**: Validates M-Pesa callback responses
- **Order Tracking**: Links payments to specific orders
- **Status Monitoring**: Real-time payment status tracking

## 🎨 UI/UX Features

### Modern Payment Interface

- **Gradient Design**: Beautiful green-gold theme
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Layout**: Works on all devices
- **Loading States**: Clear feedback during processing
- **Status Indicators**: Visual payment progress
- **Error Messages**: User-friendly error handling

### Payment Flow

1. **Product Selection** → Beautiful product cards with animations
2. **Cart Management** → Add, remove, update quantities
3. **Payment Initiation** → Clean, professional payment form
4. **Phone Verification** → Auto-format phone numbers
5. **STK Push** → Send payment request to phone
6. **Status Polling** → Real-time payment status updates
7. **Completion** → Success confirmation and order processing

## 📱 Mobile Experience

- **Responsive Design**: Optimized for mobile devices
- **Touch Interactions**: Smooth touch animations
- **Phone Integration**: Native M-Pesa integration
- **Fast Loading**: Optimized performance

## 🔍 Debugging & Troubleshooting

### Backend Logs

- Monitor console for M-Pesa API responses
- Check H2 database for transaction records
- Verify callback URL accessibility

### Frontend Debugging

- Open browser Developer Tools (F12)
- Check Network tab for API calls
- Monitor Console for JavaScript errors

### Common Issues

1. **Token Error**: Check M-Pesa credentials
2. **Network Error**: Verify backend is running on port 8080
3. **Phone Format**: Ensure proper international format (254...)
4. **Callback URL**: Must be accessible from Safaricom servers

## 🚀 Production Deployment Notes

### Environment Changes

1. Update `mpesa.environment=production`
2. Use production base URL: `https://api.safaricom.co.ke`
3. Use production credentials from Safaricom
4. Configure proper callback URL (must be HTTPS)
5. Set up SSL certificates
6. Configure proper CORS origins

### Security Considerations

- Store credentials in environment variables
- Use HTTPS for all communications
- Implement proper authentication
- Add request rate limiting
- Monitor transaction logs
- Set up alerts for failed payments

## 📊 Available Endpoints

### M-Pesa APIs

- `GET /api/mpesa/token` - Get access token
- `POST /api/mpesa/stkpush` - Initiate payment
- `POST /api/mpesa/callback` - Handle payment callbacks
- `GET /api/mpesa/status/{id}` - Check payment status

### E-commerce APIs

- `GET /api/rice-products` - Get all products
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove cart item
- `POST /api/orders` - Create order

## 🎉 Success

Your Farmcity e-commerce platform is now running with full M-Pesa integration. Users can browse products, add them to cart, and pay securely using M-Pesa mobile money.

Visit <http://localhost:3000> to start testing!
