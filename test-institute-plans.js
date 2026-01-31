// Test institute plans
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/subscriptions/plans?targetRole=INSTITUTE',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const plans = JSON.parse(data);
      console.log('INSTITUTE plans count:', plans.length);
      plans.forEach((plan, index) => {
        console.log(`Institute Plan ${index + 1}:`, {
          name: plan.name,
          targetRole: plan.targetRole,
          price: plan.price
        });
      });
    } catch (e) {
      console.log('Failed to parse JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
