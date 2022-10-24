const mongoose = require("mongoose");

const transitionSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  from: String,
  to: String,
});

module.exports = mongoose.model("transitions", transitionSchema);
