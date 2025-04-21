/**
 * Firebase integration routes for DeepGuard
 * This file contains route handlers that integrate with Firebase to store detection results
 * 
 * NOTE: This is for future use and is not currently used in the main index.js
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authMiddleware } = require('../firebase-setup');

// Initialize Firebase if not already initialized
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Save a detection result to Firebase
 * POST /firebase/save-detection
 * 
 * Requires authentication
 * 
 * Request body:
 * {
 *   mediaUrl: "https://example.com/image.jpg",
 *   result: {
 *     isFake: true,
 *     confidence: 0.92,
 *     label: "fake",
 *     modelId: "bcmi/fake-image-detection"
 *   }
 * }
 */
router.post('/save-detection', authMiddleware, async (req, res) => {
  try {
    const { mediaUrl, result } = req.body;
    const userId = req.user.uid;
    
    if (!mediaUrl || !result) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create a new detection record
    const detectionRecord = {
      userId,
      mediaUrl,
      result,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // Save to Firestore
    const docRef = await admin.firestore().collection('detections').add(detectionRecord);
    
    return res.status(201).json({
      success: true,
      id: docRef.id,
      message: 'Detection saved successfully'
    });
  } catch (error) {
    console.error('Error saving detection:', error);
    return res.status(500).json({ error: 'Failed to save detection' });
  }
});

/**
 * Get user's detection history
 * GET /firebase/detections
 * 
 * Requires authentication
 */
router.get('/detections', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const limit = parseInt(req.query.limit) || 10;
    
    // Query Firestore for user's detections
    const querySnapshot = await admin.firestore()
      .collection('detections')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    // Format the results
    const detections = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      detections.push({
        id: doc.id,
        mediaUrl: data.mediaUrl,
        result: data.result,
        timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString()
      });
    });
    
    return res.json({ history: detections });
  } catch (error) {
    console.error('Error getting detection history:', error);
    return res.status(500).json({ error: 'Failed to get detection history' });
  }
});

/**
 * Delete a detection record
 * DELETE /firebase/detections/:id
 * 
 * Requires authentication
 */
router.delete('/detections/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const detectionId = req.params.id;
    
    // First check if the detection belongs to the user
    const docRef = admin.firestore().collection('detections').doc(detectionId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Detection not found' });
    }
    
    if (doc.data().userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this detection' });
    }
    
    // Delete the document
    await docRef.delete();
    
    return res.json({
      success: true,
      message: 'Detection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting detection:', error);
    return res.status(500).json({ error: 'Failed to delete detection' });
  }
});

module.exports = router; 