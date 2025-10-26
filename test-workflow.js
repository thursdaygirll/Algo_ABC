#!/usr/bin/env node

const http = require('http');

console.log('🐝 Testing Bee Algorithm Platform Workflow');
console.log('==========================================\n');

// Test API health
function testAPIHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8001/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.status === 'ok') {
            console.log('✅ FastAPI Backend: Running on http://localhost:8001');
            resolve(true);
          } else {
            console.log('❌ FastAPI Backend: Unexpected response');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ FastAPI Backend: Invalid JSON response');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ FastAPI Backend: Not accessible -', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ FastAPI Backend: Connection timeout');
      resolve(false);
    });
  });
}

// Test Frontend
function testFrontend() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Next.js Frontend: Running on http://localhost:3000');
        resolve(true);
      } else {
        console.log(`❌ Next.js Frontend: HTTP ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Next.js Frontend: Not accessible -', error.message);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Next.js Frontend: Connection timeout');
      resolve(false);
    });
  });
}

// Test API experiment endpoint
function testExperimentAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      params: {
        feedLimit: 10,
        numBees: 20,
        iterations: 5,
        seed: 42
      },
      input: {
        mode: 'preloaded',
        datasetName: 'toy-9x5',
        matrix: [[0.1, 0.2], [0.3, 0.4]]
      }
    });

    const options = {
      hostname: 'localhost',
      port: 8001,
      path: '/run',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.durationMs && result.kpis && result.resultSeries) {
            console.log('✅ Experiment API: Working correctly');
            console.log(`   - Duration: ${result.durationMs}ms`);
            console.log(`   - Iterations: ${result.resultSeries.length}`);
            console.log(`   - KPIs: ${result.kpis.length} metrics`);
            resolve(true);
          } else {
            console.log('❌ Experiment API: Invalid response structure');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Experiment API: Invalid JSON response');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Experiment API: Request failed -', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Testing services...\n');
  
  const apiHealth = await testAPIHealth();
  const frontend = await testFrontend();
  const experimentAPI = await testExperimentAPI();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Backend API: ${apiHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Experiment API: ${experimentAPI ? '✅ PASS' : '❌ FAIL'}`);
  
  if (apiHealth && frontend && experimentAPI) {
    console.log('\n🎉 All tests passed! The Bee Algorithm Platform is ready to use.');
    console.log('\n🌐 Access the application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   API Docs: http://localhost:8001/docs');
    console.log('\n🚀 Next steps:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Click "Run New Experiment"');
    console.log('   3. Choose a preloaded dataset or upload your own');
    console.log('   4. Configure parameters and run the experiment');
    console.log('   5. View results with interactive charts!');
  } else {
    console.log('\n❌ Some tests failed. Please check the services and try again.');
  }
}

runTests().catch(console.error);
