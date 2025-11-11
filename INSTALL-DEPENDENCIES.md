# 📦 Install Dependencies Guide

## Problem

You see this error:
```
'next' is not recognized as an internal or external command
```

This means frontend dependencies haven't been installed yet.

---

## Solution: Install All Dependencies

### Step 1: Install Dependencies

From the **root directory** of the project, run:

```bash
npm run install:all
```

This will install dependencies for:
- ✅ Root project (concurrently)
- ✅ Backend (Express.js, MongoDB, etc.)
- ✅ Frontend (Next.js, React, etc.)

### Step 2: Verify Installation

Check if dependencies are installed:

```bash
# Check backend
cd backend
npm list --depth=0
cd ..

# Check frontend
cd frontend
npm list --depth=0
cd ..
```

You should see packages listed without errors.

---

## Manual Installation (If Needed)

If `npm run install:all` doesn't work, install manually:

### 1. Root Dependencies

```bash
# From root directory
npm install
```

### 2. Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## After Installation

Once dependencies are installed:

1. **Set up MongoDB** (see [MONGODB-SETUP.md](./MONGODB-SETUP.md))
2. **Set up environment files** (see [SETUP.md](./SETUP.md))
3. **Run the application**:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### "npm is not recognized"

→ Install Node.js first (see [INSTALL-FIRST.md](./INSTALL-FIRST.md))

### "PowerShell execution policy error"

→ Fix PowerShell (see [FIX-POWERSHELL.md](./FIX-POWERSHELL.md))
Or use Command Prompt instead

### "Module not found" errors

1. Delete `node_modules` folders:
   ```bash
   # Windows
   rmdir /s node_modules backend\node_modules frontend\node_modules
   
   # macOS/Linux
   rm -rf node_modules backend/node_modules frontend/node_modules
   ```

2. Delete `package-lock.json` files (optional):
   ```bash
   # Windows
   del package-lock.json backend\package-lock.json frontend\package-lock.json
   
   # macOS/Linux
   rm package-lock.json backend/package-lock.json frontend/package-lock.json
   ```

3. Reinstall:
   ```bash
   npm run install:all
   ```

### Installation takes too long

- This is normal! npm needs to download many packages
- First installation can take 2-5 minutes
- Subsequent installations are faster (uses cache)

### "EACCES: permission denied"

**Don't use `sudo` for npm install in project directories!**

Instead, fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## What Gets Installed?

### Root Dependencies
- `concurrently` - Run backend and frontend together

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `express-validator` - Input validation
- `stripe` - Payment processing
- `nodemon` - Development server (dev dependency)

### Frontend Dependencies
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `react-query` - Data fetching
- `@stripe/stripe-js` - Stripe integration
- `react-hot-toast` - Notifications
- `tailwindcss` - CSS framework
- And more...

---

## Verify Everything Works

After installation, test:

```bash
# Start the app
npm run dev
```

You should see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected (if configured)

---

**Next**: Set up MongoDB (see [MONGODB-SETUP.md](./MONGODB-SETUP.md))

