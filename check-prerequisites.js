#!/usr/bin/env node

/**
 * Prerequisites Checker Script
 * Checks if Node.js, npm, and MongoDB are installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking prerequisites...\n');

let allGood = true;

// Check Node.js
console.log('1. Checking Node.js...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const nodeVersionNum = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  console.log(`   ✅ Node.js ${nodeVersion} installed`);
  
  if (nodeVersionNum < 18) {
    console.log(`   ⚠️  Warning: Node.js v18 or higher is recommended (you have ${nodeVersion})`);
  }
} catch (error) {
  console.log('   ❌ Node.js is NOT installed');
  console.log('   📥 Please install Node.js from https://nodejs.org/');
  allGood = false;
}

// Check npm
console.log('\n2. Checking npm...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`   ✅ npm ${npmVersion} installed`);
} catch (error) {
  console.log('   ❌ npm is NOT installed');
  console.log('   📥 npm comes with Node.js. Please install Node.js from https://nodejs.org/');
  allGood = false;
}

// Check MongoDB (optional check)
console.log('\n3. Checking MongoDB connection...');
try {
  execSync('mongod --version', { encoding: 'utf-8', stdio: 'ignore' });
  console.log('   ✅ MongoDB is installed locally');
  console.log('   💡 Make sure MongoDB is running: mongod');
} catch (error) {
  console.log('   ⚠️  MongoDB not found locally');
  console.log('   💡 You can use MongoDB Atlas (cloud) instead');
  console.log('   💡 Or install MongoDB locally from https://www.mongodb.com/try/download/community');
}

// Check if dependencies are installed
console.log('\n4. Checking dependencies...');

const checkDependencies = (dir, name) => {
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log(`   ✅ ${name} dependencies installed`);
    return true;
  } else {
    console.log(`   ❌ ${name} dependencies NOT installed`);
    return false;
  }
};

const rootDeps = checkDependencies('.', 'Root');
const backendDeps = checkDependencies('backend', 'Backend');
const frontendDeps = checkDependencies('frontend', 'Frontend');

if (!rootDeps || !backendDeps || !frontendDeps) {
  console.log('\n   📦 To install dependencies, run:');
  console.log('      npm run install:all');
  allGood = false;
}

// Check environment files
console.log('\n5. Checking environment files...');

if (fs.existsSync('backend/.env')) {
  console.log('   ✅ Backend .env file exists');
} else {
  console.log('   ⚠️  Backend .env file NOT found');
  console.log('   💡 Copy backend/.env.example to backend/.env and configure it');
}

if (fs.existsSync('frontend/.env.local')) {
  console.log('   ✅ Frontend .env.local file exists');
} else {
  console.log('   ⚠️  Frontend .env.local file NOT found');
  console.log('   💡 Copy frontend/.env.local.example to frontend/.env.local and configure it');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood && rootDeps && backendDeps && frontendDeps) {
  console.log('✅ All prerequisites are met!');
  console.log('\n🚀 You can now run the application:');
  console.log('   npm run dev');
} else {
  console.log('⚠️  Some prerequisites are missing.');
  console.log('\n📋 Next steps:');
  if (!allGood) {
    console.log('   1. Install Node.js from https://nodejs.org/');
  }
  if (!rootDeps || !backendDeps || !frontendDeps) {
    console.log('   2. Install dependencies: npm run install:all');
  }
  console.log('   3. Set up environment files (see SETUP.md)');
  console.log('   4. Start MongoDB (local or Atlas)');
  console.log('   5. Run: npm run dev');
}
console.log('='.repeat(50) + '\n');

