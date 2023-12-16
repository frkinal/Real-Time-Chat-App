const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
