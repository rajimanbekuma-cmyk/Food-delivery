# 🚀 Quick Setup Guide

Follow these steps to get the Food Delivery App up and running:

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **npm** (comes with Node.js)

> ⚠️ **If you see "npm is not recognized"**: You need to install Node.js first! See [INSTALL.md](./INSTALL.md) for detailed installation instructions.

## Step-by-Step Setup

### 0. Verify Prerequisites (Optional)

Run the prerequisites checker:
```bash
npm run check
```

This will verify Node.js, npm, and check if dependencies are installed.

### 1. Install Dependencies

From the root directory:

```bash
npm run install:all
```

This will install dependencies for:
- Root package.json
- Backend (Express.js)
- Frontend (Next.js)

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service: `mongod`
- Your connection string will be: `mongodb://localhost:27017/food-delivery`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/food-delivery`)

### 3. Configure Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create `.env` file:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Stripe (Optional - for payments)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Google Maps (Optional - for delivery tracking)
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   NODE_ENV=development
   ```

### 4. Configure Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Create `.env.local` file:
   ```bash
   # Windows
   copy .env.local.example .env.local
   
   # Mac/Linux
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   
   # Stripe (Optional - for payments)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   
   # Google Maps (Optional - for delivery tracking)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### 5. Start the Application

From the root directory:

```bash
npm run dev
```

This will start:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

Or start them separately:

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### 6. Access the Application

Open your browser and navigate to:
- **Home Page**: `http://localhost:3000`
- **Customer App**: `http://localhost:3000/customer`
- **Restaurant Dashboard**: `http://localhost:3000/restaurant`
- **Driver App**: `http://localhost:3000/driver`
- **Admin Panel**: `http://localhost:3000/admin`

## Creating Your First Admin User

To create an admin user, you can:

1. Register a regular user through the app
2. Manually update the user role in MongoDB:
   ```javascript
   // In MongoDB shell or MongoDB Compass
   use food-delivery
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Testing the Application

### 1. Create Test Users

1. Go to `http://localhost:3000/login`
2. Register accounts with different roles:
   - **Customer**: Browse restaurants and place orders
   - **Restaurant**: Manage menu and orders
   - **Driver**: Accept and deliver orders
   - **Admin**: Manage platform (requires manual role update)

### 2. Test Order Flow

1. **As Customer**:
   - Browse restaurants
   - Add items to cart
   - Place an order

2. **As Restaurant**:
   - Accept the order
   - Update status (preparing → ready)

3. **As Driver**:
   - View available orders
   - Accept order
   - Update delivery status

## Optional: Stripe Setup (For Payments)

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the dashboard
3. Add them to `.env` files (backend and frontend)
4. For webhooks, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```

## Optional: Google Maps Setup (For Delivery Tracking)

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Add API key to `.env.local` in frontend

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Module Not Found Errors
- Run `npm install` in root, backend, and frontend directories
- Delete `node_modules` and reinstall if needed

### CORS Issues
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` matches backend URL

## Next Steps

- Read the [README.md](./README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI and features
- Deploy to production

Happy coding! 🎉

