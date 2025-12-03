const express = require('express');
const router = express.Router();

console.log("Loading profileController…");
const profileController = require('../controllers/profileController');
console.log("Loaded profileController:", profileController);


// Get profiles from Pyroscope
router.get('/', profileController.getProfiles);

// Get available applications
router.get('/applications', profileController.getApplications);

// Get profile types for an application
router.get('/applications/:appName/types', profileController.getProfileTypes);

// Capture system snapshot
router.post('/snapshot', profileController.captureSnapshot);

// Get profile history from MongoDB
router.get('/history', profileController.getProfileHistory);

// Get profile statistics
router.get('/stats', profileController.getProfileStats);

module.exports = router;