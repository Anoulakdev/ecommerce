const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/category");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/categorys", auth, list);

router.get("/categorys/:catId", auth, getById);

router.post("/categorys", auth, create);

router.put("/categorys/:catId", auth, update);

router.delete("/categorys/:catId", auth, remove);

module.exports = router;
