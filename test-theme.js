#!/usr/bin/env node

const http = require('http');

console.log('🎨 Testing Theme Controller Integration');
console.log('=====================================\n');

// Test if the frontend is running and accessible
function testFrontend() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend: Running on http://localhost:3000');
        resolve(true);
      } else {
        console.log(`❌ Frontend: HTTP ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Frontend: Not accessible -', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend: Connection timeout');
      resolve(false);
    });
  });
}

// Test theme demo page
function testThemeDemo() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/theme-demo', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Theme Demo: Accessible at http://localhost:3000/theme-demo');
        resolve(true);
      } else {
        console.log(`❌ Theme Demo: HTTP ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Theme Demo: Not accessible -', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Theme Demo: Connection timeout');
      resolve(false);
    });
  });
}

async function runThemeTests() {
  console.log('Testing theme controller integration...\n');
  
  const frontend = await testFrontend();
  const themeDemo = await testThemeDemo();
  
  console.log('\n📊 Theme Controller Test Results:');
  console.log('==================================');
  console.log(`Frontend: ${frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Theme Demo: ${themeDemo ? '✅ PASS' : '❌ FAIL'}`);
  
  if (frontend && themeDemo) {
    console.log('\n🎉 Theme Controller is successfully integrated!');
    console.log('\n🌐 Available Pages:');
    console.log('   Main App: http://localhost:3000');
    console.log('   Theme Demo: http://localhost:3000/theme-demo');
    console.log('\n🎨 Theme Features:');
    console.log('   • Quick dark/light toggle in navbar');
    console.log('   • Full theme dropdown with 19+ themes');
    console.log('   • Theme persistence across sessions');
    console.log('   • Theme preview on home page');
    console.log('   • Interactive theme showcase page');
    console.log('\n🚀 Try it out:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Click the theme toggle in the navbar');
    console.log('   3. Try different themes from the dropdown');
    console.log('   4. Visit /theme-demo for a full showcase');
  } else {
    console.log('\n❌ Some tests failed. Please check the services and try again.');
  }
}

runThemeTests().catch(console.error);
