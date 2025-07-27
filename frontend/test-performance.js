// Quick Performance Test Script
const API_BASE = 'http://localhost:8000/api/v1';

async function testAPIPerformance() {
  console.log('🚀 Testing API Performance...\n');
  
  const tests = [
    { name: 'Resources', url: `${API_BASE}/resources` },
    { name: 'Recommendations', url: `${API_BASE}/recommendations` },
  ];

  for (const test of tests) {
    try {
      const startTime = performance.now();
      const response = await fetch(test.url);
      const endTime = performance.now();
      const data = await response.json();
      
      const responseTime = Math.round(endTime - startTime);
      const dataSize = JSON.stringify(data).length;
      
      console.log(`✅ ${test.name}:`);
      console.log(`   ⚡ Response Time: ${responseTime}ms`);
      console.log(`   📊 Data Size: ${(dataSize / 1024).toFixed(2)}KB`);
      console.log(`   📈 Status: ${response.status === 200 ? 'OK' : 'ERROR'}\n`);
      
      if (responseTime > 2000) {
        console.log(`⚠️  Warning: ${test.name} is slow (>${responseTime}ms)`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}\n`);
    }
  }
}

// Test frontend availability
async function testFrontend() {
  try {
    const response = await fetch('http://localhost:3000');
    const responseTime = performance.now();
    console.log(`✅ Frontend: Available (${Math.round(responseTime)}ms)\n`);
  } catch (error) {
    console.log(`❌ Frontend: ERROR - ${error.message}\n`);
  }
}

// Run all tests
async function runTests() {
  console.log('🎯 Cloud Dashboard Performance Test\n');
  console.log('=====================================\n');
  
  await testFrontend();
  await testAPIPerformance();
  
  console.log('📋 Performance Summary:');
  console.log('- All API endpoints should respond < 2000ms');
  console.log('- Data should be properly formatted');
  console.log('- UI should be responsive and smooth');
  console.log('\n✨ Test Complete!');
}

runTests();
