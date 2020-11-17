const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  try {
    const order = await Order.create({
      user: ctx.user.id,
      product: ctx.request.body.product,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address
    });

    const product = await Product.findOne({
      _id: ctx.request.body.product
    });

    await sendMail({
      to: ctx.user.email,
      subject: 'Подтверждение заказа',
      locals: {id: order._id, product: product},
      template: 'order-confirmation',
    });

    ctx.body = {order: order._id};
  } catch(err) {
    ctx.throw(err);
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  try {
    const orders = await Order.find({
      user: ctx.user
    });

    ctx.body = {
      orders: orders
    }
  } catch(err) {
    ctx.throw(err);
  }
};
