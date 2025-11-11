# 🍔 Food Delivery App - UberEats Clone

A full-stack food delivery application built with Next.js, Express.js, and MongoDB. This app connects customers, restaurants, and delivery drivers in a single platform.

> ⚠️ **New to this project?** Start with [GETTING-STARTED.md](./GETTING-STARTED.md) for a quick setup guide!

## 🚀 Features

### Customer App
- 🔍 Browse nearby restaurants by category or location
- 📋 View menu items with photos, prices, and descriptions
- 🛒 Add items to cart and place orders
- 💳 Multiple payment options (Cash on delivery, Wallet, Card)
- 🚴 Real-time delivery tracking
- ⭐ Rate and review restaurants/deliveries
- 👤 View order history and receipts

### Restaurant Dashboard
- 📦 Accept or reject incoming orders
- ✏️ Update menu items, prices, and availability
- 💰 Track daily earnings and order history
- 🛠️ Manage preparation time and delivery status

### Delivery Driver App
- 📱 View available delivery orders
- 🚦 Accept or decline delivery requests
- 🗺️ Navigation to restaurant and customer (Google Maps API ready)
- 💵 View earnings and completed deliveries

### Admin Panel
- 🧍 Manage users (customers, restaurants, drivers)
- 📊 View platform analytics (orders, revenue, delivery times)
- 🚫 Ban/unban accounts for fraud prevention

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Bcrypt** - Password hashing

## 📦 Installation

### ⚠️ FIRST: Install Node.js (Required!)

**If you see "npm is not recognized"**, you need to install Node.js first:

1. **Download Node.js**: https://nodejs.org/ (Download the LTS version)
2. **Run the installer** (make sure "Add to PATH" is checked)
3. **Restart your terminal/command prompt**
4. **Verify**: Run `node --version` and `npm --version`

> 📖 **Detailed instructions**: See [INSTALL-FIRST.md](./INSTALL-FIRST.md) for step-by-step Node.js installation guide.

### ⚠️ PowerShell Users: Execution Policy Issue

**If you see "running scripts is disabled"** in PowerShell:

**Quick Fix**: Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Or use Command Prompt** instead (doesn't have this restriction)

> 📖 **Full fix guide**: See [FIX-POWERSHELL.md](./FIX-POWERSHELL.md)

### Prerequisites
- **Node.js (v18 or higher)** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js - no separate installation needed)
- **MongoDB** (local or cloud instance)

### Quick Setup

1. **Check Prerequisites** (Optional but recommended)
   ```bash
   npm run check
   ```
   This will verify Node.js, npm, and MongoDB are installed.

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   
   This installs dependencies for:
   - Root package (concurrently for running both servers)
   - Backend (Express.js, MongoDB, etc.)
   - Frontend (Next.js, React, etc.)

3. **Set up environment variables** (See [SETUP.md](./SETUP.md))

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Update `.env` with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

   Update `.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend app on `http://localhost:3000`

## 🎯 Usage

1. **Access the app**: Open `http://localhost:3000` in your browser
2. **Register/Login**: Create an account or login with existing credentials
3. **Choose your role**: 
   - Customer: Browse restaurants and place orders
   - Restaurant: Manage orders and menu
   - Driver: Accept and deliver orders
   - Admin: Manage platform and view analytics

## 📁 Project Structure

```
Project/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── app/             # Next.js app directory
│   │   ├── customer/    # Customer app pages
│   │   ├── restaurant/ # Restaurant dashboard
│   │   ├── driver/      # Driver app
│   │   └── admin/       # Admin panel
│   ├── lib/             # Utilities and API client
│   └── components/      # React components
└── README.md
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in cookies and automatically included in API requests.

## 💳 Payment Integration

Stripe is integrated for card payments. For development, use Stripe test keys. The app also supports:
- Cash on delivery
- Wallet payments

## 🗺️ Google Maps Integration

Google Maps API is ready for integration. Add your API key to the environment variables to enable:
- Restaurant location display
- Delivery tracking
- Route navigation for drivers

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (restaurant role)
- `PUT /api/restaurants/:id` - Update restaurant

### Menu
- `GET /api/menu/restaurant/:restaurantId` - Get menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders (filtered by role)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/rating` - Rate order

### Drivers
- `GET /api/drivers/available-orders` - Get available orders
- `POST /api/drivers/accept-order/:orderId` - Accept order
- `GET /api/drivers/my-deliveries` - Get driver deliveries
- `GET /api/drivers/stats` - Get driver statistics

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/restaurants` - Get all restaurants
- `GET /api/admin/orders` - Get all orders

## 🚀 Deployment

### Backend
- Deploy to services like Render, Railway, or AWS
- Set environment variables
- Ensure MongoDB connection (MongoDB Atlas recommended)

### Frontend
- Deploy to Vercel, Netlify, or AWS
- Set environment variables
- Update API URL to production backend

## 🔮 Future Enhancements

- 📍 AI-based restaurant recommendations
- 🧾 Invoice download for customers
- 💬 In-app chat between customer and driver
- 🌍 Multi-language support
- 🏅 Loyalty program or rewards points
- 📱 Mobile app (React Native)

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, Express.js, and MongoDB

