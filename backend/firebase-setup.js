/**
 * Firebase Admin SDK setup for future integration
 * Use this file when you're ready to integrate Firebase authentication
 * 
 * To use:
 * 1. Add the following to your .env file:
 *    FIREBASE_PROJECT_ID=your_project_id
 *    FIREBASE_CLIENT_EMAIL=your_client_email
 *    FIREBASE_PRIVATE_KEY=your_private_key
 * 
 * 2. Import and use the verifyIdToken function in your routes
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
let firebaseApp;
if (!admin.apps.length) {
  // Initialize with environment variables
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key needs to replace escaped newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  firebaseApp = admin.app();
}

/**
 * Verifies Firebase ID token from Authorization header
 * @param {string} authHeader - The Authorization header (Bearer token)
 * @returns {Promise<DecodedIdToken>} The decoded token with user info
 * @throws {Error} If token is invalid or missing
 */
async function verifyIdToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Unauthorized: Invalid token');
  }
}

/**
 * Example middleware to protect routes that require authentication
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await verifyIdToken(authHeader);
    
    // Add user info to request for use in route handlers
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = {
  firebaseApp,
  verifyIdToken,
  authMiddleware,
}; 