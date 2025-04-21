/**
 * Utility functions for interacting with Replicate API
 */
const axios = require('axios');

// Map of model IDs to their specific versions
const MODEL_VERSIONS = {
  'bcmi/fake-image-detection': '9b9c0080071a648fdf41d3bb5242579f3975889265f4d36af5628c8c60a1f347',
  'wzhouwzhou/deepfake-detection': 'b471be898a2a6b4a67635a252743ac194d56aaaf14e5c21456818f6c9a351c93',
  // Add more models as needed
};

/**
 * Run a deepfake detection on the provided media URL
 * @param {string} mediaUrl - URL to the image to analyze
 * @param {string} apiToken - Replicate API token
 * @param {string} modelId - Model ID to use (defaults to bcmi/fake-image-detection)
 * @returns {Promise<Object>} Detection results
 */
async function detectDeepfake(mediaUrl, apiToken, modelId = 'bcmi/fake-image-detection') {
  if (!apiToken) {
    throw new Error('Replicate API token is required');
  }

  const modelVersion = MODEL_VERSIONS[modelId];
  if (!modelVersion) {
    throw new Error(`Unknown model ID: ${modelId}`);
  }

  // Start the prediction
  const prediction = await startPrediction(mediaUrl, apiToken, modelId, modelVersion);
  
  // Poll for results
  const result = await pollForResults(prediction.id, apiToken);
  
  // Process and format the results
  return formatResults(result, mediaUrl, modelId);
}

/**
 * Start a prediction with Replicate API
 * @param {string} mediaUrl - URL to the image to analyze
 * @param {string} apiToken - Replicate API token
 * @param {string} modelId - Model ID to use
 * @param {string} modelVersion - Model version to use
 * @returns {Promise<Object>} Prediction object with ID
 */
async function startPrediction(mediaUrl, apiToken, modelId, modelVersion) {
  console.log(`Starting prediction with ${modelId} for ${mediaUrl}`);
  
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: modelVersion,
        input: { image: mediaUrl }
      },
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Prediction started with ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('Error starting prediction:', error.response?.data || error.message);
    throw new Error(`Failed to start prediction: ${error.response?.data?.detail || error.message}`);
  }
}

/**
 * Poll for prediction results
 * @param {string} predictionId - ID of the prediction to check
 * @param {string} apiToken - Replicate API token
 * @param {number} maxAttempts - Maximum number of polling attempts
 * @returns {Promise<Object>} Prediction results
 */
async function pollForResults(predictionId, apiToken, maxAttempts = 30) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Wait 1 second between polling attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const status = response.data.status;
      
      if (status === 'succeeded') {
        console.log(`Prediction succeeded after ${attempts} attempts`);
        return response.data;
      } else if (status === 'failed') {
        console.error(`Prediction failed: ${response.data.error}`);
        throw new Error(`Prediction failed: ${response.data.error}`);
      }
      
      console.log(`Waiting for prediction result... (${attempts}/${maxAttempts})`);
    } catch (error) {
      console.error('Error polling for results:', error.response?.data || error.message);
      throw new Error(`Failed to poll for results: ${error.response?.data?.detail || error.message}`);
    }
  }
  
  throw new Error('Prediction timed out');
}

/**
 * Format and process the prediction results
 * @param {Object} prediction - Prediction object from Replicate API
 * @param {string} mediaUrl - Original media URL
 * @param {string} modelId - Model ID used
 * @returns {Object} Formatted results
 */
function formatResults(prediction, mediaUrl, modelId) {
  const output = prediction.output;
  
  // Different models have different output formats
  if (modelId === 'bcmi/fake-image-detection') {
    // This model returns a probability value between 0 and 1
    const probability = parseFloat(output);
    const isFake = probability > 0.75;
    
    return {
      result: {
        isFake,
        confidence: probability,
        label: isFake ? 'fake' : 'real',
        mediaUrl,
        modelId
      },
      raw: output
    };
  } else if (modelId === 'wzhouwzhou/deepfake-detection') {
    // Adjust this based on the actual output format of this model
    // This is a placeholder implementation
    const isFake = output.includes('fake');
    const confidence = isFake ? 0.85 : 0.15;
    
    return {
      result: {
        isFake,
        confidence,
        label: isFake ? 'fake' : 'real',
        mediaUrl,
        modelId
      },
      raw: output
    };
  }
  
  // Generic handling for unknown models
  return {
    result: {
      mediaUrl,
      modelId
    },
    raw: output
  };
}

module.exports = {
  detectDeepfake,
  MODEL_VERSIONS
}; 