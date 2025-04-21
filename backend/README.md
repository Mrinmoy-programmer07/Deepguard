# DeepGuard Backend

Backend service for DeepGuard, providing AI-powered deepfake detection.

## 🎯 Features

- **Deepfake Detection API**: Analyze images for deepfake content using AI models hosted on Replicate
- **Multiple Detection Models**: Supports various deepfake detection models
- **Scan History**: Retrieve scan history (with Firebase integration for authenticated users)
- **Health Check**: Endpoint for health monitoring

## 🛠️ Tech Stack

- **Node.js + Express**: Fast, minimalist web framework
- **Axios**: Promise-based HTTP client for making API calls
- **Replicate API**: ML model hosting and inference
- **Firebase Admin SDK**: (Optional) User authentication and data storage
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing support

## 🔧 Setup & Installation

1. Clone the repository
2. Install dependencies
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Replicate API key
   ```bash
   cp .env.example .env
   ```
4. Start the server
   ```bash
   npm start
   ```
   
Development mode with auto-reload:
```bash
npm run dev
```

## 🚀 API Reference

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok"
}
```

### Available Models

```
GET /models
```

Response:
```json
{
  "models": [
    { "id": "bcmi/fake-image-detection" },
    { "id": "wzhouwzhou/deepfake-detection" }
  ]
}
```

### Detect Deepfakes

```
POST /detect
```

Request body:
```json
{
  "mediaUrl": "https://example.com/image.jpg",
  "modelId": "bcmi/fake-image-detection" // optional, defaults to bcmi/fake-image-detection
}
```

Response:
```json
{
  "result": {
    "isFake": true,
    "confidence": 0.92,
    "label": "fake",
    "mediaUrl": "https://example.com/image.jpg",
    "modelId": "bcmi/fake-image-detection"
  },
  "raw": "0.92"
}
```

### Get History (Demo)

```
GET /history
```

Response:
```json
{
  "history": [
    {
      "id": "1",
      "mediaUrl": "https://example.com/image1.jpg",
      "timestamp": "2023-11-14T12:00:00.000Z",
      "result": {
        "isFake": true,
        "confidence": 0.92,
        "label": "fake"
      },
      "modelId": "bcmi/fake-image-detection"
    },
    ...
  ]
}
```

## 🔥 Firebase Integration (Optional)

For user authentication and history tracking, you can enable the Firebase integration:

1. Set up a Firebase project and obtain service account credentials
2. Add Firebase config to your `.env` file:
   ```
   FIREBASE_PROJECT_ID="your_project_id"
   FIREBASE_CLIENT_EMAIL="your_client_email"
   FIREBASE_PRIVATE_KEY="your_private_key"
   ```
3. Uncomment the Firebase routes in `index.js`:
   ```javascript
   // Firebase routes
   const firebaseRoutes = require('./routes/firebase-integration');
   app.use('/firebase', firebaseRoutes);
   ```

## 🧪 Testing

Run the test script to verify the API is working correctly:

```bash
npm test
```

This will test all endpoints with sample data and ensure the connection to the Replicate API is working.

## 📦 Deployment

### Deploy to Vercel

```bash
npm run deploy:vercel
```

### Deploy to Railway

```bash
npm run deploy:railway
```

### Custom Deployment Script

For guided deployment with environment variable setup:

```bash
npm run deploy
```

## 📝 Sample Usage

### cURL

```bash
curl -X POST http://localhost:3000/detect \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl": "https://replicate.delivery/pbxt/Ar9CXM6nnQK1v7rmwvCvAXwXrM2zHyZKKbGfuJvWnpv874cE/pexels-sora-shimazaki-5668484.jpg"}'
```

### JavaScript

```javascript
const response = await fetch('http://localhost:3000/detect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mediaUrl: 'https://example.com/image.jpg',
  }),
});

const result = await response.json();
console.log(result.result.isFake ? 'Fake detected!' : 'Image appears genuine');
```

## 📄 License

MIT 