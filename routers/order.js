const express = require("express");
const router = express.Router();

// controllers
const {
  listOrder,
  listCancel,
  listProcess,
  getById,
  create,
  update,
  remove,
} = require("../controllers/order");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/orderlist", auth, listOrder);

router.get("/ordercancle", auth, listCancel);

router.get("/orderprocess", auth, listProcess);

// router.get("/orders/:orderId", auth, getById);

router.post("/orders", auth, create);

// router.put("/orders/:orderId", auth, update);

// router.delete("/orders/:orderId", auth, remove);

module.exports = router;
