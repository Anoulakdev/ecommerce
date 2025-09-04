const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getProduct,
  getById,
  create,
  update,
  remove,
} = require("../controllers/product");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/products", auth, checkRole([3]), list);

router.get("/products/getproduct", auth, getProduct);

router.get("/products/:productId", auth, checkRole([3]), getById);

router.post("/products", auth, checkRole([3]), create);

router.put("/products/:productId", auth, checkRole([3]), update);

router.delete("/products/:productId", auth, checkRole([3]), remove);

module.exports = router;
