const express = require('express');
const router = express.Router();
const usermac = require('../controllers/usermac');

// Route to add a MAC address
router.post('/addMacAddress', usermac.addMACAddress);

// Route to get all MAC addresses for the logged-in user
router.get('/getAllMacAddresses', usermac.getAllMACAddresses);

module.exports = router;
