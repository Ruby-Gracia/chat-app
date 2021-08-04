const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: "Name is required!",
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: "room is required!",
    ref: "roomlists",
  },
});

module.exports = mongoose.model("User", userSchema);
