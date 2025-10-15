const fs = require("fs");
const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const moment = require("moment-timezone");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./uploads/organize");
    cb(null, path.join(process.env.UPLOAD_BASE_PATH, "payment"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Appending file extension
  },
});

const upload = multer({ storage: storage }).single("payimg");

exports.create = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors
      return res.status(500).json({
        message: "Multer error occurred when uploading.",
        error: err.message,
      });
    } else if (err) {
      // Handle other types of errors
      return res.status(500).json({
        message: "Unknown error occurred when uploading.",
        error: err.message,
      });
    }

    try {
      // Destructure body values
      const { orderId, productstatusId, comment } = req.body;

      // Step 1: Validate input fields
      if (!orderId || !productstatusId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // ทำ Transaction
      const result = await prisma.$transaction(async (tx) => {
        const orderStatus = await tx.orderStatus.create({
          data: {
            orderId: Number(orderId),
            productstatusId: Number(productstatusId),
            payimg: req.file ? req.file.filename : null,
            comment,
            userCode: req.user.code,
          },
        });

        await tx.order.update({
          where: { id: Number(orderId) },
          data: { currentStatusId: Number(productstatusId) },
        });

        return orderStatus;
      });

      res.status(201).json({
        message: "OrderStatus created successfully",
        data: result,
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server Error");
    }
  });
};
