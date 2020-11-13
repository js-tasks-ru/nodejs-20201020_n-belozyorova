const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (typeof ctx.request.query.subcategory === 'undefined') {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(ctx.request.query.subcategory)) {
    ctx.body = {products: []};
    return;
  }

  ctx.body = {products: await Product.find({subcategory: ctx.request.query.subcategory})};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: await Product.find()};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'Invalid identifier');
    return;
  }

  let product = await Product.findOne({_id: ctx.params.id});

  if (product === null) {
    ctx.throw(404, 'Product not found')
  }

  ctx.body = {product: await Product.findOne({_id: ctx.params.id})};
};
