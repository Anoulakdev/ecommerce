const express = require("express");
const router = express.Router();

// controllers
const {
  listOrder,
  listCancel,
  listProcess,
  listSeller,
  listEcommerce,
  getById,
  create,
  remove,
} = require("../controllers/order");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/orderlist", auth, listOrder);

router.get("/ordercancle", auth, listCancel);

router.get("/orderprocess", auth, listProcess);

router.get("/orderseller", auth, listSeller);

router.get("/orderecommerce", auth, listEcommerce);

router.get("/orders/:orderId", auth, getById);

router.post("/orders", auth, create);

router.delete("/orders/:orderId", auth, remove);

module.exports = router;
