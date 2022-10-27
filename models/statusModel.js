const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  title: String,
  initial: Boolean,
});

module.exports = mongoose.model("statuses", statusSchema);
