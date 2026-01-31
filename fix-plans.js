// Fix existing plans by updating their targetRole
const http = require('http');

// Update teacher plan
const updateTeacherPlan = () => {
  const data = JSON.stringify({
    id: "cb114038-0b4c-4a88-8026-fff0222ead57",
    targetRole: "TEACHER"
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/subscriptions/plans/cb114038-0b4c-4a88-8026-fff0222ead57',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Teacher plan update status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log('Teacher plan response:', chunk.toString());
    });
  });

  req.on('error', (error) => {
    console.error('Teacher plan error:', error.message);
  });

  req.write(data);
  req.end();
};

// Update institute plan
const updateInstitutePlan = () => {
  const data = JSON.stringify({
    id: "9f93ede6-1cb9-4263-8db6-4f1bca4bf419",
    targetRole: "INSTITUTE"
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/subscriptions/plans/9f93ede6-1cb9-4263-8db6-4f1bca4bf419',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Institute plan update status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log('Institute plan response:', chunk.toString());
    });
  });

  req.on('error', (error) => {
    console.error('Institute plan error:', error.message);
  });

  req.write(data);
  req.end();
};

console.log('Updating plans...');
updateTeacherPlan();
setTimeout(updateInstitutePlan, 1000);
