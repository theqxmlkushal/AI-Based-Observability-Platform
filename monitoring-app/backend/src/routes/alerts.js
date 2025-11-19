const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Webhook endpoint for Alertmanager
router.post('/webhook', alertController.receiveAlertWebhook);

// Get alert history
router.get('/history', alertController.getAlertHistory);

// Get alert statistics
router.get('/stats', alertController.getAlertStats);

module.exports = router;