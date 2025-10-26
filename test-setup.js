#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🐝 Bee Algorithm Platform - Setup Verification');
console.log('==============================================\n');

// Check if required directories exist
const requiredDirs = [
  'algoabcapp',
  'algoabcapp/app',
  'algoabcapp/components',
  'algoabcapp/lib',
  'algoabcapp/types',
  'algoabcapp/data',
  'bee-fastapi'
];

console.log('📁 Checking directory structure...');
let allDirsExist = true;
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
    allDirsExist = false;
  }
});

// Check if key files exist
const requiredFiles = [
  'algoabcapp/package.json',
  'algoabcapp/app/layout.tsx',
  'algoabcapp/app/(marketing)/page.tsx',
  'algoabcapp/app/new-experiment/page.tsx',
  'algoabcapp/app/experiments/page.tsx',
  'algoabcapp/app/experiments/[id]/page.tsx',
  'bee-fastapi/main.py',
  'bee-fastapi/schema.py',
  'bee-fastapi/requirements.txt'
];

console.log('\n📄 Checking key files...');
let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('algoabcapp/package.json', 'utf8'));
  const requiredDeps = ['daisyui', 'react-apexcharts', 'apexcharts', 'papaparse', 'xlsx', 'zustand'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
  allFilesExist = false;
}

console.log('\n🚀 Setup Instructions:');
console.log('=====================');
console.log('1. Install dependencies:');
console.log('   cd algoabcapp && npm install');
console.log('   cd bee-fastapi && pip install -r requirements.txt');
console.log('');
console.log('2. Start the backend:');
console.log('   cd bee-fastapi && uvicorn main:app --reload --port 8001');
console.log('');
console.log('3. Start the frontend (in a new terminal):');
console.log('   cd algoabcapp && NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev');
console.log('');
console.log('4. Or use the Makefile:');
console.log('   make install && make dev');
console.log('');
console.log('5. Access the application:');
console.log('   Frontend: http://localhost:3000');
console.log('   API: http://localhost:8001');

if (allDirsExist && allFilesExist) {
  console.log('\n✅ Setup verification completed successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Setup verification failed. Please check the missing files/directories.');
  process.exit(1);
}
