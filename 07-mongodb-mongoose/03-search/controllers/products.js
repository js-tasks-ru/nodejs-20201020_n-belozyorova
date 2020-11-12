const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if (typeof ctx.request.query.query === 'undefined') {
    ctx.body = {products: []};
    return;
  }

  ctx.body = {products: await Product.find({$text: {$search: ctx.request.query.query}})};
};
