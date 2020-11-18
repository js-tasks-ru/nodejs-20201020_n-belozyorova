const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\+?\d{6,14}/.test(v);
      },
      message: 'Неверный формат номера телефона.'
    },
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

module.exports = connection.model('Order', orderSchema);
