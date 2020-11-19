const mongoose = require('mongoose');
const connection = require('../libs/connection');

const messageSchema = new mongoose.Schema(
    {
    user: {
      type: String,
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.chat;

        return ret;
      }
    }
  }
);

module.exports = connection.model('Message', messageSchema);
