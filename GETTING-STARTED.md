# 🚀 Getting Started - Quick Guide

## Step 1: Install Node.js (If you see "npm is not recognized")

**This is the most important step!**

1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (the big green button)
3. Run the installer
4. ✅ Make sure "Add to PATH" is checked
5. **Restart your terminal/command prompt**
6. Verify it worked:
   ```bash
   node --version
   npm --version
   ```

> 📖 **Need help?** See [INSTALL-FIRST.md](./INSTALL-FIRST.md) for detailed instructions.

---

## Step 2: Install Dependencies

Once Node.js is installed, run:

```bash
npm run install:all
```

This installs all required packages for:
- Root project
- Backend (Express.js, MongoDB, etc.)
- Frontend (Next.js, React, etc.)

> ⚠️ **If you see "'next' is not recognized"**: Dependencies aren't installed yet. Run `npm run install:all` again. See [INSTALL-DEPENDENCIES.md](./INSTALL-DEPENDENCIES.md) for help.

---

## Step 3: Set Up Environment Files

### Backend

1. Go to `backend` folder
2. Copy `.env.example` to `.env`
3. Edit `.env` and set:
   ```env
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=your-secret-key-here
   ```

### Frontend

1. Go to `frontend` folder
2. Copy `.env.local.example` to `.env.local`
3. Edit `.env.local` and set:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

## Step 4: Start MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended) ⭐**
- Create free account: https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `MONGODB_URI` in `backend/.env`
- No local installation needed!

**Option B: Local MongoDB**
- Install MongoDB from: https://www.mongodb.com/try/download/community
- Start it: `mongod` (or it starts automatically as a service)

> ⚠️ **If you see "MongoDB connection error"**: MongoDB isn't running or configured. See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for detailed setup.

---

## Step 5: Run the Application

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

---

## Step 6: Access the App

Open your browser:
- **Home**: http://localhost:3000
- **Login/Register**: http://localhost:3000/login

---

## Quick Troubleshooting

### PowerShell: "running scripts is disabled"
→ **Quick Fix**: Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Or use **Command Prompt** instead (doesn't have this issue)

> 📖 **Full fix guide**: [FIX-POWERSHELL.md](./FIX-POWERSHELL.md)

### "npm is not recognized"
→ Install Node.js first (Step 1)

### "'next' is not recognized" or "Cannot find module"
→ Dependencies aren't installed. Run `npm run install:all`
→ See [INSTALL-DEPENDENCIES.md](./INSTALL-DEPENDENCIES.md) for help

### "MongoDB connection error"
→ MongoDB isn't running or configured
→ See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for setup guide
→ **Easiest**: Use MongoDB Atlas (cloud) - no local installation needed!

### Port already in use
→ Change `PORT` in `backend/.env` or kill the process using the port

---

## Need More Help?

- **Node.js Installation**: [INSTALL-FIRST.md](./INSTALL-FIRST.md)
- **Detailed Setup**: [SETUP.md](./SETUP.md)
- **Full Installation Guide**: [INSTALL.md](./INSTALL.md)
- **Project Documentation**: [README.md](./README.md)

---

**Happy coding! 🎉**

