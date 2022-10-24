const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  title: String,
  description: String | undefined,
});

module.exports = mongoose.model("statuses", statusSchema);
