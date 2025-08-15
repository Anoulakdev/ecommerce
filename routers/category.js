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

router.get("/categorys", list);

router.get("/categorys/:catId", getById);

router.post("/categorys", create);

router.put("/categorys/:catId", update);

router.delete("/categorys/:catId", remove);

module.exports = router;
