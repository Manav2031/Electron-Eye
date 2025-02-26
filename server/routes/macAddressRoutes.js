const express = require('express');
const router = express.Router();
const macAddressController = require('../controllers/macAddressController');

router.post('/check-mac', macAddressController.checkMACAddress);
router.post('/startTracking', macAddressController.startTracking);
router.post('/stopTracking', macAddressController.stopTracking);
router.post('/getTracking', macAddressController.getTracking);
router.post(
  '/display-browser-history',
  macAddressController.displayBrowserHistory
);
router.post(
  '/display-network-details',
  macAddressController.displayNetworkDetails
);
router.post(
  '/display-network-requests',
  macAddressController.displayNetworkRequests
);
router.post(
  '/display-connected-devices',
  macAddressController.displayConnectedDevices
);
router.post('/check-system-health', macAddressController.checkSystemHealth);
router.get(
  '/display-cheating-devices',
  macAddressController.displayCheatingDevices
);
router.post('/shutdown-system', macAddressController.shutdownSystem);
module.exports = router;
