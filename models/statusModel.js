const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  title: String,
  initial: Boolean,
  previous: { type: mongoose.Schema.Types.ObjectId, ref: "statuses" },
  following: { type: mongoose.Schema.Types.ObjectId, ref: "statuses" },
});

module.exports = mongoose.model("statuses", statusSchema);
