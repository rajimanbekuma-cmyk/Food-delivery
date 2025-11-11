# 🔧 Fix PowerShell Execution Policy Issue

## Problem

You see this error when running `npm`:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

This happens because PowerShell's execution policy is blocking scripts by default.

## ✅ Solution: Fix PowerShell Execution Policy

### Option 1: Change Execution Policy (Recommended)

Open PowerShell **as Administrator**:

1. **Right-click** on PowerShell/Windows Terminal
2. Select **"Run as Administrator"**
3. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Type `Y` when prompted
5. Close and reopen PowerShell

**Verify it worked:**
```powershell
npm --version
```

### Option 2: Use Command Prompt Instead

If you don't want to change PowerShell settings, use **Command Prompt (cmd)** instead:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd C:\Users\rajim\OneDrive\Desktop\Project
   ```
4. Run npm commands:
   ```cmd
   npm --version
   npm run install:all
   ```

### Option 3: Bypass for Current Session Only

If you only need to run npm once, you can bypass the policy for the current session:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm --version
```

Note: This only works for the current PowerShell window.

---

## Quick Fix Commands

**Run these in PowerShell as Administrator:**

```powershell
# Set execution policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verify npm works
npm --version
```

---

## Alternative: Use Command Prompt

If you prefer not to change PowerShell settings:

1. Open **Command Prompt** (not PowerShell)
2. Navigate to project folder
3. Run all npm commands normally

Command Prompt doesn't have this restriction, so npm will work immediately.

---

## Why This Happens

Windows PowerShell has security policies that prevent scripts from running by default. npm uses PowerShell scripts (`.ps1` files) on Windows, so it needs permission to run them.

The `RemoteSigned` policy allows:
- ✅ Local scripts (like npm) to run
- ✅ Downloaded scripts only if they're signed
- ✅ Keeps your system secure

---

## Verify Fix

After applying the fix, test:

```powershell
node --version
npm --version
npm run install:all
```

All commands should work without errors.

---

## Still Having Issues?

1. **Make sure you ran PowerShell as Administrator**
2. **Restart PowerShell** after changing the policy
3. **Try Command Prompt** as an alternative
4. **Check if Node.js is installed correctly:**
   ```powershell
   where.exe node
   where.exe npm
   ```

---

## Next Steps

Once npm is working:

1. Install dependencies:
   ```powershell
   npm run install:all
   ```

2. Set up environment files (see SETUP.md)

3. Run the application:
   ```powershell
   npm run dev
   ```

---

**Need more help?** Check [INSTALL-FIRST.md](./INSTALL-FIRST.md) or [GETTING-STARTED.md](./GETTING-STARTED.md)

