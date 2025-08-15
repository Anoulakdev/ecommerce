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

router.get("/reviews", auth, list);

router.get("/reviews/:reviewId", auth, getById);

router.post("/reviews", auth, create);

router.put("/reviews/:reviewId", auth, update);

router.delete("/reviews/:reviewId", auth, remove);

module.exports = router;
