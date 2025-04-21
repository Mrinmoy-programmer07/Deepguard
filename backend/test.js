/**
 * Simple test script for the DeepGuard API
 * Run with: node test.js
 */
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test image URLs
const TEST_IMAGES = [
  // Known real image from Pexels
  'https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg',
  
  // Known AI-generated image from Replicate
  'https://replicate.delivery/pbxt/Ar9CXM6nnQK1v7rmwvCvAXwXrM2zHyZKKbGfuJvWnpv874cE/pexels-sora-shimazaki-5668484.jpg'
];

// API base URL
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Running DeepGuard API tests...\n');
  
  try {
    // Test health endpoint
    console.log('Testing /health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test models endpoint
    console.log('\nTesting /models endpoint...');
    const modelsResponse = await axios.get(`${API_URL}/models`);
    console.log('✅ Models check passed:', modelsResponse.data);
    
    // Test history endpoint
    console.log('\nTesting /history endpoint...');
    const historyResponse = await axios.get(`${API_URL}/history`);
    console.log('✅ History check passed. Sample item:', historyResponse.data.history[0]);
    
    // Test detect endpoint with sample images
    console.log('\nTesting /detect endpoint with sample images...');
    
    for (const imageUrl of TEST_IMAGES) {
      console.log(`\nTesting detection on: ${imageUrl}`);
      try {
        const detectResponse = await axios.post(
          `${API_URL}/detect`,
          { mediaUrl: imageUrl },
          { 
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        console.log('✅ Detection result:', detectResponse.data.result);
      } catch (error) {
        console.error('❌ Detection test failed:', error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests(); 