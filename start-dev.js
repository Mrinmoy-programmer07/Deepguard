/**
 * Start both frontend and backend servers for development
 */
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting DeepGuard development servers...');

// Start backend server
const backendProcess = exec('npm run dev', {
  cwd: path.join(__dirname, 'backend'),
});

backendProcess.stdout.on('data', (data) => {
  console.log(`\x1b[36m[Backend]\x1b[0m ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`\x1b[31m[Backend Error]\x1b[0m ${data}`);
});

console.log('✅ Backend server started on port 3000');

// Start frontend server in 2 seconds (give backend time to start)
setTimeout(() => {
  console.log('🔄 Starting frontend server...');
  
  const frontendProcess = exec('npm run dev -- --port 3001', {
    cwd: __dirname,
  });
  
  frontendProcess.stdout.on('data', (data) => {
    console.log(`\x1b[32m[Frontend]\x1b[0m ${data}`);
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.error(`\x1b[31m[Frontend Error]\x1b[0m ${data}`);
  });
  
  console.log('✅ Frontend server started on port 3001');
  console.log('🌐 Open http://localhost:3001 in your browser');
  
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('👋 Shutting down servers...');
  backendProcess.kill();
  process.exit();
}); 