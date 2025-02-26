const mongoose = require("mongoose")

//schema design
const macAddressSchema = new mongoose.Schema(
    {
        macAddress:{
            type: String,
            unique: true,
            required: [true, "MAC Address is required"],
        }
    },
);

//export
const macadd = mongoose.model("mac_addresses", macAddressSchema);

async function getMACAddress(macAddressToFetch) {
    try {
      const mac = await macadd.findOne({ macAddress: macAddressToFetch });
      if (mac) {
        return mac.macAddress;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching MAC address:', error);
      throw error;
    }
  }
  
  module.exports = { getMACAddress };