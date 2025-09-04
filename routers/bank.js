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

router.get("/banks", auth, list);

router.get("/banks/:bankId", auth, getById);

router.post("/banks", auth, checkRole([4]), create);

router.put("/banks/:bankId", auth, checkRole([4]), update);

router.delete("/banks/:bankId", auth, checkRole([4]), remove);

module.exports = router;
