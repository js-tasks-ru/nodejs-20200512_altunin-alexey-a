const Category = require('../models/Category');

function mapSubCategory(subCategory) {
  return {
    id: subCategory._id,
    title: subCategory.title,
  };
}

function mapCategory(category) {
  return {
    id: category._id,
    title: category.title,
    subcategories: category.subcategories.map(mapSubCategory),
  };
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const mappedCategories = categories.map(mapCategory);
  ctx.body = {categories: mappedCategories};
};
