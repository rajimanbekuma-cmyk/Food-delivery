# 📦 Installation Guide

## Prerequisites Check

Before installing dependencies, you need to have **Node.js** and **npm** installed on your system.

### Check if Node.js is Installed

Open your terminal/command prompt and run:

```bash
node --version
npm --version
```

If you see version numbers (e.g., `v18.0.0` and `9.0.0`), you're good to go! Skip to [Install Dependencies](#install-dependencies).

If you see "command not found" or "not recognized", continue below.

---

## Installing Node.js and npm

### Windows

1. **Download Node.js**:
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Run the Installer**:
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - ✅ Make sure "Add to PATH" is checked (usually checked by default)
   - Click "Install"

3. **Verify Installation**:
   - Close and reopen your terminal/command prompt
   - Run:
     ```bash
     node --version
     npm --version
     ```
   - You should see version numbers

### macOS

**Option 1: Official Installer**
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the macOS Installer (.pkg)
3. Run the installer and follow the instructions

**Option 2: Using Homebrew** (Recommended)
```bash
brew install node
```

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

---

## Install Dependencies

Once Node.js and npm are installed, follow these steps:

### Step 1: Install Root Dependencies

From the project root directory:

```bash
npm install
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Alternative: Install All at Once

From the root directory, run:

```bash
npm run install:all
```

This command will install dependencies for root, backend, and frontend automatically.

---

## Verify Installation

After installation, verify everything is set up correctly:

```bash
# Check Node.js version (should be v18 or higher)
node --version

# Check npm version
npm --version

# Verify backend dependencies
cd backend
npm list --depth=0
cd ..

# Verify frontend dependencies
cd frontend
npm list --depth=0
cd ..
```

---

## Troubleshooting

### "npm is not recognized" Error

**Solution**: 
1. Make sure Node.js is installed (see above)
2. **Restart your terminal/command prompt** after installing Node.js
3. If still not working, restart your computer
4. Verify Node.js is in your PATH:
   - Windows: Check System Environment Variables
   - The installer should add it automatically

### "Permission Denied" Error (Linux/macOS)

**Solution**:
```bash
# Don't use sudo for npm install in project directories
# If you get permission errors, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### "Module not found" Errors

**Solution**:
1. Delete `node_modules` folders:
   ```bash
   # From root directory
   rm -rf node_modules backend/node_modules frontend/node_modules
   # Windows: Use rmdir /s instead of rm -rf
   ```
2. Delete `package-lock.json` files (optional):
   ```bash
   rm package-lock.json backend/package-lock.json frontend/package-lock.json
   ```
3. Reinstall:
   ```bash
   npm run install:all
   ```

### Port Already in Use

If port 3000 or 5000 is already in use:

**Windows**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
# Find process using port 5000
lsof -ti:5000
# Kill the process
kill -9 $(lsof -ti:5000)
```

---

## Next Steps

After successfully installing dependencies:

1. **Set up environment variables** - See [SETUP.md](./SETUP.md)
2. **Start MongoDB** - Local or MongoDB Atlas
3. **Run the application**:
   ```bash
   npm run dev
   ```

---

## Need Help?

- Check [SETUP.md](./SETUP.md) for configuration details
- Check [README.md](./README.md) for full documentation
- Node.js Documentation: [https://nodejs.org/docs/](https://nodejs.org/docs/)

