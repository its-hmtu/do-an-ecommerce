const {Tag, Category, TagImage, CategoryImage} = require('../models');

exports.getTags = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  const tags = await Tag.findAndCountAll({
    limit: pageSize,
    offset: offset
  })

  // data pagination
  if (!tags) {
    return res.status(404).json({message: 'Tags not found'});
  }

  const totalItemCount = tags.count
  const currentItemCount = tags.rows.length
  const currentPage = page
  const totalPages = Math.ceil(totalItemCount / pageSize)
  
  const pagination = {
    total_item_count: totalItemCount,
    current_item_count: currentItemCount,
    total_pages: totalPages,
    current_page: currentPage
  }

  return res.status(200).json({
    data: {
      ...pagination,
      tags: tags.rows
    }
  });
}

exports.getCategories = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  const categories = await Category.findAndCountAll({
    limit: pageSize,
    offset: offset
  })

  if (!categories) {
    return res.status(404).json({message: 'Categories not found'});
  }

  const totalItemCount = categories.count
  const currentItemCount = categories.rows.length
  const currentPage = page
  const totalPages = Math.ceil(totalItemCount / pageSize)

  const pagination = {
    total_item_count: totalItemCount,
    current_item_count: currentItemCount,
    total_pages: totalPages,
    current_page: currentPage
  }

  return res.status(200).json({
    data: {
      ...pagination,
      categories: categories.rows
    }
  });
}