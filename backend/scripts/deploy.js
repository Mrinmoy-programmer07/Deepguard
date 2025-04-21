/**
 * DeepGuard deployment script
 * This script helps set up environment variables for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function deployToVercel() {
  console.log('Preparing to deploy to Vercel...');

  // Check if vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('Vercel CLI not found. Please install it with: npm i -g vercel');
    process.exit(1);
  }

  // Ensure .env file exists
  if (!fs.existsSync(path.join(__dirname, '..', '.env'))) {
    console.log('Creating .env file...');
    fs.copyFileSync(
      path.join(__dirname, '..', '.env.example'),
      path.join(__dirname, '..', '.env')
    );
  }

  // Check for Replicate API token
  const replicateToken = await promptQuestion('Enter your Replicate API token: ');
  if (replicateToken) {
    const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const updatedContent = envContent.replace(
      /REPLICATE_API_TOKEN=.*/,
      `REPLICATE_API_TOKEN="${replicateToken}"`
    );
    fs.writeFileSync(path.join(__dirname, '..', '.env'), updatedContent);
  }

  // Set up environment variables for Vercel
  console.log('Setting up Vercel environment variables...');
  try {
    execSync(`vercel env add REPLICATE_API_TOKEN`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to set Vercel environment variables:', error.message);
  }

  // Deploy to Vercel
  console.log('Deploying to Vercel...');
  try {
    execSync('vercel', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('Deployment successful!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }

  rl.close();
}

async function deployToRailway() {
  console.log('Preparing to deploy to Railway...');

  // Check if Railway CLI is installed
  try {
    execSync('railway --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('Railway CLI not found. Please install it with: npm i -g @railway/cli');
    process.exit(1);
  }

  // Ensure .env file exists
  if (!fs.existsSync(path.join(__dirname, '..', '.env'))) {
    console.log('Creating .env file...');
    fs.copyFileSync(
      path.join(__dirname, '..', '.env.example'),
      path.join(__dirname, '..', '.env')
    );
  }

  // Check for Replicate API token
  const replicateToken = await promptQuestion('Enter your Replicate API token: ');
  if (replicateToken) {
    const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const updatedContent = envContent.replace(
      /REPLICATE_API_TOKEN=.*/,
      `REPLICATE_API_TOKEN="${replicateToken}"`
    );
    fs.writeFileSync(path.join(__dirname, '..', '.env'), updatedContent);
  }

  // Login to Railway
  console.log('Please login to Railway...');
  try {
    execSync('railway login', { stdio: 'inherit' });
  } catch (error) {
    console.error('Railway login failed:', error.message);
    process.exit(1);
  }

  // Deploy to Railway
  console.log('Deploying to Railway...');
  try {
    execSync('railway up', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('Deployment successful!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }

  rl.close();
}

async function main() {
  console.log('DeepGuard Deployment Script');
  console.log('=========================\n');

  const deployTarget = await promptQuestion('Where would you like to deploy? (vercel/railway): ');

  if (deployTarget.toLowerCase() === 'vercel') {
    await deployToVercel();
  } else if (deployTarget.toLowerCase() === 'railway') {
    await deployToRailway();
  } else {
    console.log('Invalid option. Please choose "vercel" or "railway".');
    rl.close();
  }
}

main(); 