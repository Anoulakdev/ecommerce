const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/review");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/reviews", auth, checkRole([3]), list);

router.get("/reviews/:reviewId", auth, checkRole([3]), getById);

router.post("/reviews", auth, checkRole([3]), create);

router.put("/reviews/:reviewId", auth, checkRole([3]), update);

router.delete("/reviews/:reviewId", auth, checkRole([3]), remove);

module.exports = router;
