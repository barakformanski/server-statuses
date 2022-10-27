const mongoose = require("mongoose");

const transitionSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  // from: String,
  // to: String,
  from: { type: mongoose.Schema.Types.ObjectId, ref: "statuses" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "statuses" },
});

module.exports = mongoose.model("transitions", transitionSchema);
