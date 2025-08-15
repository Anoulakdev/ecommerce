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

router.get("/productstatus", list);

router.get("/productstatus/:pStatusId", getById);

router.post("/productstatus", create);

router.put("/productstatus/:pStatusId", update);

router.delete("/productstatus/:pStatusId", remove);

module.exports = router;
