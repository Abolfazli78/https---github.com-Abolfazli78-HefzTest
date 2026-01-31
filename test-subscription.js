// Simple test script to initialize subscription plans
const http = require('http');

const data = JSON.stringify({});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/subscriptions/init-plans',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
