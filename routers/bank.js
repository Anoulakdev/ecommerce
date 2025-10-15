const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/bank");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/banks", auth, checkRole([3]), list);

router.get("/banks/:bankId", auth, checkRole([3]), getById);

router.post("/banks", auth, checkRole([3]), create);

router.put("/banks/:bankId", auth, checkRole([3]), update);

router.delete("/banks/:bankId", auth, checkRole([3]), remove);

module.exports = router;
