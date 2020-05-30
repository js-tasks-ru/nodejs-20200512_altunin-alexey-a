const Product = require('../models/Product');

function mapProduct(product) {
  return {
    title: product.title,
    id: product.id,
    category: product.category,
    subcategory: product.subcategory._id,
    price: product.price,
    description: product.description,
    images: product.images,
  };
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcaragoryId = ctx.url.split('subcategory=')[1];

  if (subcaragoryId === undefined) {
    return next();
  }

  const productList = await Product.find({"subcategory": subcaragoryId});

  ctx.body = {products: productList.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const productList = await Product.find();

  ctx.body = {products: productList.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);

  if (product === null) {
    ctx.throw(404, 'product not found');
  }

  ctx.body = {product: mapProduct(product)};
};

