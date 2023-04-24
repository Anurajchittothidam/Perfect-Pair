const category = require("../modal/categories");
const subCategory = require("../modal/subCategories");
const mongoose = require("mongoose");

const categoryController = {
  findAllCategory: async (req, res) => {
    try {
      const categories = await category.find();
      const subCategories = await subCategory.find();
      let index = 0;
      let message = req.session.catExist;
      if (message) {
        delete req.session.catExist;
      }
      res.render("./admin/category", {
        categories,
        index,
        subCategories,
        message,
      });
    } catch (err) {
      res.redirect('/admin/error')
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name, subname } = req.body;
      if (name !== "") {
        const existingCategory = await category.findOne({
          category_name: name,
        });
        if (existingCategory) {
          req.session.catExist = "This category alredy exist";
          return res.redirect("/admin/category");
        } else {
          const subCategoryArray = await subCategory.find({ _id: subname });

          const categories = new category({
            category_name: name,
            subCategory: subCategoryArray,
          });
          await categories.save();
          res.redirect("/admin/category");
        }
      } else {
        req.session.catExist = "Category name is required";
        res.redirect("/admin/category");
      }
    } catch (err) {
      res.redirect('/admin/error')
    }
  },

  editCategory: async (req, res) => {
    try {
      if (req.body.name.trim()) {
        const id = req.params.id;
        const name = req.body.name;
        const subname = req.body.subname;
        const subCategoryArray = await subCategory.find({ _id: subname });
        if (subCategoryArray.length === 0) {
          req.session.catExist = "At least one subcategory is required";
          return res.redirect("/admin/category");
        }

        const categoryExist = await category.findOne({ category_name: name });
        if (categoryExist) {
          req.session.catExist = "This category alredy exist";
          return res.redirect("/admin/category");
        } else {
          await category.updateOne(
            { _id: id },
            { $set: { category_name: name, subCategory: subCategoryArray } }
          );
          res.redirect("/admin/category");
        }
      } else {
        req.session.catExist = "category name is requied";
        res.redirect("/admin/category");
      }
    } catch (err) {
      res.redirect('/admin/error')
    }
  },
  editsubCat: async (req, res) => {
    try {
      
        const id = req.params.id;
        const subname = req.body.subname;
        const subCategoryArray = await subCategory.find({ _id: subname });
        if (subCategoryArray.length === 0) {
          req.session.catExist = "At least one subcategory is required";
          return res.redirect("/admin/category");
        } else {
          await category.updateOne(
            { _id: id },
            { $set: { subCategory: subCategoryArray } }
          );
          res.redirect("/admin/category");
        }
    } catch (err) {
      res.redirect('/admin/error')
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const deleteCat = await category.updateOne(
        { _id: id },
        { $set: { delete: true } }
      );
      if (deleteCat) {
        res.redirect("/admin/category");
      } else {
        req.session.catExist = "something went wrong";
        res.redirect("/admin/category");
      }
    } catch (err) {
      res.redirect('/admin/error')
    }
  },

  restoreCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const restoreCat = await category.updateOne(
        { _id: id },
        { $set: { delete: false } }
      );
      if (restoreCat) {
        res.redirect("/admin/category");
      } else {
        req.session.catExist = "something went wrong";
        res.redirect("/admin/category");
      }
    } catch (err) {
      res.redirect('/admin/error')
    }
  },

  getSubCategories: async (req, res, next) => {
    try {
      const categoryId = req.body.category;
      const categoryID = new mongoose.Types.ObjectId(categoryId);
      const categories = await category
        .findOne({ _id: categoryID })
        .populate("subCategory")
        .select("subCategory");
      const subCategoryIds = categories.subCategory;
      const subCategories = await subCategory
        .find({ _id: { $in: subCategoryIds } })
        .select("subCategory_name");
      res.json(subCategories);
    } catch (err) {
      res.redirect('/admin/error')
    }
  },
};

module.exports = categoryController;
