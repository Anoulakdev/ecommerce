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

router.get("/banks", list);

router.get("/banks/:bankId", getById);

router.post("/banks", create);

router.put("/banks/:bankId", update);

router.delete("/banks/:bankId", remove);

module.exports = router;
