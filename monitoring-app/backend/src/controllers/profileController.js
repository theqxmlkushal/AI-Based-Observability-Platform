const Profile = require('../models/Profile');
const pyroscopeService = require('../services/pyroscopeService');

// Get profiles from Pyroscope
exports.getProfiles = async (req, res) => {
  try {
    const { query, from, until } = req.query;

    const result = await pyroscopeService.queryProfiles(
      query,
      from ? parseInt(from) : null,
      until ? parseInt(until) : null
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch profiles',
      message: error.message 
    });
  }
};

// Get available applications from Pyroscope
exports.getApplications = async (req, res) => {
  try {
    const apps = await pyroscopeService.getApplications();
    res.json({
      success: true,
      data: apps,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch applications',
      message: error.message 
    });
  }
};

// Get profile types for an application
exports.getProfileTypes = async (req, res) => {
  try {
    const { appName } = req.params;
    const types = await pyroscopeService.getProfileTypes(appName);
    res.json({
      success: true,
      data: types,
    });
  } catch (error) {
    console.error('Error fetching profile types:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch profile types',
      message: error.message 
    });
  }
};

// Capture current system profile snapshot
exports.captureSnapshot = async (req, res) => {
  try {
    const { type = 'memory' } = req.body;

    let snapshot;
    if (type === 'memory') {
      snapshot = pyroscopeService.captureMemorySnapshot();
    } else if (type === 'cpu') {
      snapshot = pyroscopeService.captureCPUProfile();
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid profile type. Use "memory" or "cpu"' 
      });
    }

    // Save to MongoDB
    const profile = await Profile.create({
      profileType: snapshot.profileType,
      service: 'monitoring-backend',
      duration: 0,
      data: snapshot.data,
      metadata: snapshot.metadata,
    });

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error capturing snapshot:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Get profile history from MongoDB
exports.getProfileHistory = async (req, res) => {
  try {
    const { 
      limit = 50, 
      profileType,
      service,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    if (profileType) query.profileType = profileType;
    if (service) query.service = service;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const profiles = await Profile.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error('Error fetching profile history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Get profile statistics
exports.getProfileStats = async (req, res) => {
  try {
    const total = await Profile.countDocuments();
    const cpu = await Profile.countDocuments({ profileType: 'cpu' });
    const memory = await Profile.countDocuments({ profileType: 'memory' });
    const heap = await Profile.countDocuments({ profileType: 'heap' });

    // Get recent profiles count (last hour)
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentProfiles = await Profile.countDocuments({ 
      timestamp: { $gte: oneHourAgo } 
    });

    // Get latest memory snapshot
    const latestMemory = await Profile.findOne({ 
      profileType: 'memory' 
    }).sort({ timestamp: -1 });

    // Get latest CPU snapshot
    const latestCPU = await Profile.findOne({ 
      profileType: 'cpu' 
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      stats: {
        total,
        byType: {
          cpu,
          memory,
          heap,
        },
        recentProfiles,
        latest: {
          memory: latestMemory,
          cpu: latestCPU,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};