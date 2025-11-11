# 🍃 MongoDB Setup Guide

## Problem

You see this error:
```
❌ MongoDB connection error: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

This means MongoDB is not running or not configured properly.

---

## Solution: Choose One Option

### Option 1: MongoDB Atlas (Cloud - Recommended for Beginners) ⭐

**Easiest option - No local installation needed!**

1. **Create Free Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/food-delivery`

6. **Update Backend .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
   ```
   Replace `username` and `password` with your database user credentials.

7. **Restart Backend**:
   ```bash
   npm run dev:backend
   ```

✅ **Done!** MongoDB Atlas is now connected.

---

### Option 2: Local MongoDB Installation

**For local development**

#### Windows

1. **Download MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or higher)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**:
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)
   - Click "Install"

3. **Verify Installation**:
   - MongoDB should start automatically as a Windows service
   - Check Services: Press `Win + R`, type `services.msc`
   - Look for "MongoDB" service (should be running)

4. **Test Connection**:
   ```bash
   mongosh
   ```
   If it connects, you're good!

5. **Update Backend .env** (if needed):
   ```env
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   ```

6. **Restart Backend**:
   ```bash
   npm run dev:backend
   ```

#### macOS

**Using Homebrew** (Recommended):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify**:
```bash
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

---

## Verify MongoDB Connection

After setting up MongoDB, test the connection:

1. **Start Backend**:
   ```bash
   npm run dev:backend
   ```

2. **Look for this message**:
   ```
   ✅ MongoDB connected successfully
   ```

3. **If you still see errors**:
   - Check your `.env` file has correct `MONGODB_URI`
   - Make sure MongoDB is running (local) or cluster is active (Atlas)
   - Check network access (for Atlas)

---

## Troubleshooting

### Local MongoDB: "Service not found"

**Windows**:
```bash
# Install MongoDB as a service
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --dbpath "C:\data\db"
net start MongoDB
```

**macOS/Linux**:
```bash
# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Local MongoDB: "Cannot connect"

1. **Check if MongoDB is running**:
   ```bash
   # Windows
   sc query MongoDB
   
   # macOS/Linux
   brew services list          # macOS
   sudo systemctl status mongod # Linux
   ```

2. **Start MongoDB manually**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas: "Authentication failed"

- Double-check username and password in connection string
- Make sure you URL-encoded the password (replace special characters)
- Verify database user has correct privileges

### MongoDB Atlas: "IP not whitelisted"

- Go to "Network Access" in Atlas
- Add your current IP address
- Or temporarily allow access from anywhere (0.0.0.0/0) for development

---

## Quick Reference

**MongoDB Atlas (Recommended)**:
```
1. Sign up at mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (or allow all)
5. Copy connection string
6. Update backend/.env
```

**Local MongoDB**:
```
1. Download from mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Update backend/.env (if needed)
```

---

## Next Steps

Once MongoDB is connected:

1. ✅ Backend should show: `✅ MongoDB connected successfully`
2. ✅ Frontend dependencies need to be installed (see below)
3. ✅ Run: `npm run dev`

---

**Need help?** Check the main [SETUP.md](./SETUP.md) guide.

