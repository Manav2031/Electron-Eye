const MacModel = require('../models/macmodel');

// Add a MAC address to the database
exports.addMACAddress = async (req, res) => {
  const { macAddress, systemName, userId } = req.body;

  if (!macAddress || !systemName || !userId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newMacAddress = new MacModel({ macAddress, systemName, userId });
    const savedMacAddress = await newMacAddress.save();

    res.status(201).json({ message: 'MAC address added successfully', data: savedMacAddress });
  } catch (error) {
    console.error('Error adding MAC address:', error);
    if (error.code === 11000) {
      // Handle duplicate MAC address error
      return res.status(409).json({ error: 'MAC address already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all MAC addresses for the logged-in user
exports.getAllMACAddresses = async (req, res) => {
  const { userId } = req.query; // Assuming `userId` is passed as a query parameter

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const macAddresses = await MacModel.find({ userId });

    if (macAddresses.length === 0) {
      return res.status(404).json({ message: 'No MAC addresses found for this user' });
    }

    res.status(200).json(macAddresses);
  } catch (error) {
    console.error('Error retrieving MAC addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
