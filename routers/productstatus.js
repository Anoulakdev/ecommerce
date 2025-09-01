const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/productstatus");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/productstatus", auth, list);

router.get("/productstatus/:pStatusId", auth, getById);

router.post("/productstatus", auth, create);

router.put("/productstatus/:pStatusId", auth, update);

router.delete("/productstatus/:pStatusId", auth, remove);

module.exports = router;
