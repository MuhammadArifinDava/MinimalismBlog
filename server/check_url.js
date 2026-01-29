const http = require('http');

const url = 'http://localhost:5000/uploads/1769663449445-58438472.png';

http.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  console.log(`Content-Length: ${res.headers['content-length']}`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Body:', data));
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});