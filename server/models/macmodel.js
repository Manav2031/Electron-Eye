const mongoose = require('mongoose');

const MacSchema = new mongoose.Schema({
  macAddress: {
    type: String,
    required: true,
    unique: true,
  },
  systemName: {
    type: String,
    required: true,
  },
  userId:{
    type:String,
    required:true,  
  },
});

const macmodel = mongoose.model('macAddress', MacSchema);
module.exports = macmodel;
