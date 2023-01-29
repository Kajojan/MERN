const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: {
  
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {},
  callendars:{
    type: Array,
  }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema)
