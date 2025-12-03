const express = require('express');
const router = express.Router();
console.log("Loading logController…");
const logController = require('../controllers/logController');
console.log("Loaded logController:", logController);


// Get logs from Loki
router.get('/', logController.getLogs);

// Get log range (time-based query)
router.get('/range', logController.getLogRange);

// Get available labels
router.get('/labels', logController.getLabels);

// Get label values
router.get('/labels/:label/values', logController.getLabelValues);

// Get log history from MongoDB
router.get('/history', logController.getLogHistory);

// Get log statistics
router.get('/stats', logController.getLogStats);

// Create a log entry
router.post('/', logController.createLog);

module.exports = router;