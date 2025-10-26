#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Bee Algorithm Platform - Setup Verification');
console.log('==============================================\n');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function logSuccess(message) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️${colors.reset} ${message}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️${colors.reset} ${message}`);
}

// Check if command exists and returns version
function checkCommand(command, minVersion = null) {
  try {
    const version = execSync(`${command} --version`, { encoding: 'utf8' }).trim();
    if (minVersion) {
      // Simple version comparison (works for most cases)
      const currentVersion = version.match(/\d+\.\d+\.\d+/)?.[0] || version;
      logSuccess(`${command}: ${currentVersion}`);
      return true;
    } else {
      logSuccess(`${command}: ${version}`);
      return true;
    }
  } catch (error) {
    logError(`${command}: Not found`);
    return false;
  }
}

// Check if file exists
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    logSuccess(`${description}: Found`);
    return true;
  } else {
    logError(`${description}: Not found at ${filePath}`);
    return false;
  }
}

// Check if directory exists and has content
function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length > 0) {
    logSuccess(`${description}: Found with content`);
    return true;
  } else {
    logError(`${description}: Not found or empty at ${dirPath}`);
    return false;
  }
}

// Check Python packages
function checkPythonPackages() {
  try {
    execSync('python3 -c "import fastapi, uvicorn, pydantic, numpy"', { encoding: 'utf8' });
    logSuccess('Python packages: All required packages installed');
    return true;
  } catch (error) {
    logError('Python packages: Some packages missing');
    return false;
  }
}

// Check Node.js packages
function checkNodePackages() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('algoabcapp/package.json', 'utf8'));
    const requiredDeps = ['react', 'next', 'daisyui', 'react-apexcharts', 'apexcharts', 'papaparse', 'xlsx', 'zustand'];
    
    let allFound = true;
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        logSuccess(`Node package ${dep}: ${packageJson.dependencies[dep]}`);
      } else {
        logError(`Node package ${dep}: Missing`);
        allFound = false;
      }
    });
    
    return allFound;
  } catch (error) {
    logError('Node packages: Could not verify');
    return false;
  }
}

// Main verification function
function verifySetup() {
  let allChecksPassed = true;
  
  console.log('Checking system requirements...\n');
  
  // Check Node.js
  if (!checkCommand('node')) {
    allChecksPassed = false;
  }
  
  // Check npm
  if (!checkCommand('npm')) {
    allChecksPassed = false;
  }
  
  // Check Python
  if (!checkCommand('python3')) {
    allChecksPassed = false;
  }
  
  // Check pip
  if (!checkCommand('pip3')) {
    allChecksPassed = false;
  }
  
  // Check Git
  if (!checkCommand('git')) {
    allChecksPassed = false;
  }
  
  console.log('\nChecking project structure...\n');
  
  // Check project files
  const requiredFiles = [
    'algoabcapp/package.json',
    'algoabcapp/next.config.ts',
    'bee-fastapi/main.py',
    'bee-fastapi/requirements.txt',
    'docker-compose.yml',
    'Makefile'
  ];
  
  requiredFiles.forEach(file => {
    if (!checkFile(file, `File ${file}`)) {
      allChecksPassed = false;
    }
  });
  
  console.log('\nChecking dependencies...\n');
  
  // Check if dependencies are installed
  if (!checkDirectory('algoabcapp/node_modules', 'Frontend dependencies')) {
    allChecksPassed = false;
  }
  
  // Check Python packages
  if (!checkPythonPackages()) {
    allChecksPassed = false;
  }
  
  // Check Node packages
  if (!checkNodePackages()) {
    allChecksPassed = false;
  }
  
  console.log('\nChecking configuration...\n');
  
  // Check environment file
  if (fs.existsSync('algoabcapp/.env.local')) {
    logSuccess('Environment file: Found');
  } else {
    logWarning('Environment file: Not found (will be created automatically)');
  }
  
  // Check data directory
  if (fs.existsSync('algoabcapp/data')) {
    logSuccess('Data directory: Found');
  } else {
    logWarning('Data directory: Not found (will be created automatically)');
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allChecksPassed) {
    logSuccess('All checks passed! Setup is complete. 🎉');
    console.log('\nNext steps:');
    console.log('1. Start the backend: cd bee-fastapi && uvicorn main:app --reload --port 8001');
    console.log('2. Start the frontend: cd algoabcapp && npm run dev');
    console.log('3. Or use: make dev (from project root)');
    console.log('\nAccess the application:');
    console.log('- Frontend: http://localhost:3000');
    console.log('- Backend: http://localhost:8001');
    console.log('- API Docs: http://localhost:8001/docs');
  } else {
    logError('Some checks failed. Please review the errors above.');
    console.log('\nTroubleshooting:');
    console.log('1. Run the setup script: ./setup.sh (macOS/Linux) or setup.bat (Windows)');
    console.log('2. Check REQUIREMENTS.md for detailed instructions');
    console.log('3. Ensure all prerequisites are installed');
  }
  
  console.log('\nFor more help, see REQUIREMENTS.md');
}

// Run verification
verifySetup();
