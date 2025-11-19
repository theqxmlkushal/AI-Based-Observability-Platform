const Alert = require('../models/Alert');
const { broadcastAlert } = require('../services/websocketService');

// Webhook endpoint to receive alerts from Alertmanager
exports.receiveAlertWebhook = async (req, res) => {
  try {
    console.log('Received alert webhook:', JSON.stringify(req.body, null, 2));

    const { alerts } = req.body;

    if (!alerts || !Array.isArray(alerts)) {
      return res.status(400).json({ error: 'Invalid alert format' });
    }

    const savedAlerts = [];

    for (const alert of alerts) {
      const alertData = {
        alertname: alert.labels?.alertname || 'Unknown',
        severity: alert.labels?.severity || 'warning',
        status: alert.status,
        description: alert.annotations?.description || '',
        summary: alert.annotations?.summary || '',
        labels: alert.labels || {},
        annotations: alert.annotations || {},
        startsAt: alert.startsAt ? new Date(alert.startsAt) : new Date(),
        endsAt: alert.endsAt ? new Date(alert.endsAt) : null,
        fingerprint: alert.fingerprint,
        generatorURL: alert.generatorURL,
      };

      // Save to database
      const savedAlert = await Alert.create(alertData);
      savedAlerts.push(savedAlert);

      // Broadcast to connected WebSocket clients
      broadcastAlert(savedAlert);

      console.log(`Alert saved and broadcasted: ${alertData.alertname} (${alertData.status})`);
    }

    res.status(200).json({
      message: 'Alerts received and processed',
      count: savedAlerts.length,
    });
  } catch (error) {
    console.error('Error processing alert webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get alert history
exports.getAlertHistory = async (req, res) => {
  try {
    const { limit = 50, status, severity } = req.query;

    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .sort({ receivedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error('Error fetching alert history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const total = await Alert.countDocuments();
    const firing = await Alert.countDocuments({ status: 'firing' });
    const resolved = await Alert.countDocuments({ status: 'resolved' });
    const critical = await Alert.countDocuments({ severity: 'critical' });
    const warning = await Alert.countDocuments({ severity: 'warning' });

    res.json({
      success: true,
      stats: {
        total,
        firing,
        resolved,
        critical,
        warning,
      },
    });
  } catch (error) {
    console.error('Error fetching alert stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};