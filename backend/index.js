const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { detectDeepfake, MODEL_VERSIONS } = require('./utils/replicate');

const app = express();

// Load environment variables
dotenv.config();

// CORS configuration - allow requests from any origin
const corsOptions = {
  origin: '*', // In production, you should restrict this to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get available models
app.get('/models', (req, res) => {
  res.json({
    models: Object.keys(MODEL_VERSIONS).map(id => ({ id }))
  });
});

// Detect deepfakes route
app.post('/detect', async (req, res) => {
  try {
    const { mediaUrl, modelId = 'bcmi/fake-image-detection' } = req.body;

    // Validate input
    if (!mediaUrl) {
      return res.status(400).json({ error: 'Missing mediaUrl in request body' });
    }

    if (!mediaUrl.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid mediaUrl format' });
    }

    // Check for Replicate API token
    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateApiToken) {
      return res.status(500).json({ error: 'Replicate API token not configured' });
    }

    // Verify model ID
    if (modelId && !MODEL_VERSIONS[modelId]) {
      return res.status(400).json({
        error: 'Invalid model ID',
        availableModels: Object.keys(MODEL_VERSIONS)
      });
    }

    console.log(`Processing detection for media: ${mediaUrl} using model: ${modelId}`);

    // Run detection using the utility function
    const result = await detectDeepfake(mediaUrl, replicateApiToken, modelId);
    
    // Adjust the result to improve accuracy
    // Use a higher threshold (0.75) for determining fake images
    // The default threshold is 0.5, but that seems to produce too many false positives
    if (result && result.result) {
      const { confidence } = result.result;
      const isFake = confidence > 0.75; // Increased threshold to reduce false positives
      
      result.result.isFake = isFake;
      result.result.label = isFake ? 'fake' : 'real';
    }
    
    return res.json(result);

  } catch (error) {
    console.error('Error in /detect:', error);
    
    // Handle Replicate API errors
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({ 
        error: 'Error from Replicate API', 
        details: error.response.data 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// History route (dummy data for now)
app.get('/history', (req, res) => {
  // In the future, this would come from Firebase or another database
  const dummyHistory = [
    {
      id: '1',
      mediaUrl: 'https://example.com/image1.jpg',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      result: { isFake: true, confidence: 0.92, label: 'fake' },
      modelId: 'bcmi/fake-image-detection'
    },
    {
      id: '2',
      mediaUrl: 'https://example.com/image2.jpg',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      result: { isFake: false, confidence: 0.12, label: 'real' },
      modelId: 'bcmi/fake-image-detection'
    },
    {
      id: '3',
      mediaUrl: 'https://example.com/image3.jpg',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      result: { isFake: true, confidence: 0.78, label: 'fake' },
      modelId: 'wzhouwzhou/deepfake-detection'
    }
  ];
  
  res.json({ history: dummyHistory });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Pre-flight OPTIONS request handling
app.options('*', cors(corsOptions));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeepGuard backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Models list: http://localhost:${PORT}/models`);
  console.log(`\nExample usage:`);
  console.log(`\ncurl -X POST http://localhost:${PORT}/detect \\
  -H "Content-Type: application/json" \\
  -d '{"mediaUrl": "https://replicate.delivery/pbxt/Ar9CXM6nnQK1v7rmwvCvAXwXrM2zHyZKKbGfuJvWnpv874cE/pexels-sora-shimazaki-5668484.jpg"}'`);
}); 