// Debug script to check subscription plans in database
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/subscriptions/plans?targetRole=STUDENT',
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
    console.log('Response length:', data.length);
    console.log('Response:', data);
    
    try {
      const plans = JSON.parse(data);
      console.log('Number of plans:', plans.length);
      plans.forEach((plan, index) => {
        console.log(`Plan ${index + 1}:`, {
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
