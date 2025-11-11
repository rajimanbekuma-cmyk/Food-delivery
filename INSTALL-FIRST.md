# 🚨 IMPORTANT: Install Node.js First!

If you see **"npm is not recognized"** or **"npm: command not found"**, you need to install **Node.js** first before you can install dependencies.

## Quick Fix: Install Node.js

### For Windows Users

1. **Download Node.js**:
   - Go to: https://nodejs.org/
   - Click the big green button that says **"Download Node.js (LTS)"**
   - This will download a `.msi` file (e.g., `node-v20.x.x-x64.msi`)

2. **Run the Installer**:
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - ✅ **IMPORTANT**: Make sure "Add to PATH" is checked (it usually is by default)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Restart Your Terminal/Command Prompt**:
   - Close your current terminal/command prompt window
   - Open a NEW terminal/command prompt window
   - This is important so it picks up the new PATH

4. **Verify Installation**:
   ```bash
   node --version
   npm --version
   ```
   
   You should see version numbers like:
   ```
   v20.10.0
   10.2.3
   ```

5. **If it still doesn't work**:
   - Restart your computer
   - Or manually add Node.js to PATH:
     - Search for "Environment Variables" in Windows
     - Edit System Environment Variables
     - Add `C:\Program Files\nodejs\` to PATH

### For macOS Users

**Option 1: Official Installer**
1. Go to: https://nodejs.org/
2. Download the macOS installer (.pkg)
3. Run the installer and follow instructions

**Option 2: Using Homebrew** (Recommended)
```bash
brew install node
```

### For Linux Users

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Verify:**
```bash
node --version
npm --version
```

---

## After Installing Node.js

Once Node.js and npm are installed, you can proceed with the project setup:

1. **Check Prerequisites** (Optional):
   ```bash
   # Windows
   check-prerequisites.bat
   
   # Or use npm script (after installing root dependencies)
   npm run check
   ```

2. **Install Project Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment files** (See [SETUP.md](./SETUP.md))

4. **Run the application**:
   ```bash
   npm run dev
   ```

---

## Still Having Issues?

### PowerShell Execution Policy Error

If you see:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

**Quick Fix:**
1. Open PowerShell **as Administrator**
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` when prompted
4. Restart PowerShell

**Or use Command Prompt instead** (doesn't have this restriction)

> 📖 **Detailed fix**: See [FIX-POWERSHELL.md](./FIX-POWERSHELL.md)

### "npm is not recognized" after installing Node.js

1. **Close and reopen your terminal/command prompt**
2. **Restart your computer** (sometimes needed for PATH changes)
3. **Verify Node.js is in PATH**:
   - Windows: Open Command Prompt and type: `where node`
   - You should see: `C:\Program Files\nodejs\node.exe`
   - If not, Node.js wasn't added to PATH during installation

### "Permission Denied" (Linux/macOS)

Don't use `sudo` for `npm install` in project directories. If you get permission errors, fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## Need More Help?

- **Node.js Installation Guide**: https://nodejs.org/en/download/package-manager/
- **npm Documentation**: https://docs.npmjs.com/
- **Project Setup Guide**: See [SETUP.md](./SETUP.md)
- **Full Installation Guide**: See [INSTALL.md](./INSTALL.md)

---

## Quick Reference

```bash
# 1. Install Node.js from https://nodejs.org/
# 2. Restart terminal/command prompt
# 3. Verify installation:
node --version
npm --version

# 4. Install project dependencies:
npm run install:all

# 5. Set up environment files (see SETUP.md)
# 6. Run the app:
npm run dev
```

---

**Remember**: npm comes with Node.js, so once you install Node.js, you'll have npm too! 🎉

