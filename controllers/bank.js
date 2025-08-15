const fs = require("fs");
const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const moment = require("moment-timezone");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./uploads/notice");
    cb(null, path.join(process.env.UPLOAD_BASE_PATH, "bank"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Appending file extension
  },
});

const upload = multer({ storage: storage }).single("bankqr");

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
      const { name, accountNo, accountName } = req.body;

      // Step 1: Validate input fields
      if (!name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Step 4: Create new user
      const banks = await prisma.bank.create({
        data: {
          name,
          accountNo,
          accountName,
          bankqr: req.file ? `${req.file.filename}` : null,
        },
      });

      res.status(201).json({
        message: "bank created successfully!",
        data: banks,
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server Error");
    }
  });
};

exports.list = async (req, res) => {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const formatted = banks.map((bank) => ({
      ...bank,
      createdAt: moment(bank.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(bank.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { bankId } = req.params;

    const bank = await prisma.bank.findUnique({
      where: {
        id: Number(bankId),
      },
    });

    if (!bank) {
      return res.status(404).json({ message: "banks not found" });
    }

    const formatted = {
      ...bank,
      createdAt: moment(bank.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(bank.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    res.json(formatted);
  } catch (err) {
    // err
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.update = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({
        message: "Multer error occurred during upload.",
        error: err,
      });
    } else if (err) {
      return res.status(500).json({
        message: "Unknown error occurred during upload.",
        error: err,
      });
    }

    try {
      const { bankId } = req.params;
      const { name, accountNo, accountName } = req.body;

      // Step 1: Find the user to update
      const banks = await prisma.bank.findUnique({
        where: {
          id: Number(bankId),
        },
      });

      if (!banks) {
        return res.status(404).json({ message: "banks not found" });
      }

      // Step 2: If a new photo is uploaded and an old photo exists, delete the old photo
      let bankfilePath = banks.bankqr; // Keep old photo path
      if (req.file) {
        // Only attempt to delete if there is an existing photo path
        if (banks.bankqr) {
          const oldBankFilePath = path.join(
            process.env.UPLOAD_BASE_PATH,
            "bank",
            path.basename(banks.bankqr)
          );
          fs.unlink(oldBankFilePath, (err) => {
            if (err) {
              console.error("Error deleting old file: ", err);
            }
          });
        }

        // Set the new photo path
        bankfilePath = `${req.file.filename}`;
      }

      // Step 3: Update the user record
      const updated = await prisma.bank.update({
        where: {
          id: Number(bankId),
        },
        data: {
          name,
          accountNo,
          accountName,
          bankqr: bankfilePath,
        },
      });

      res.json({ message: "Update successful!", data: updated });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
};

exports.remove = async (req, res) => {
  try {
    const { bankId } = req.params;

    // Step 1: Find the user by ID
    const banks = await prisma.bank.findUnique({
      where: {
        id: Number(bankId),
      },
    });

    if (!banks) {
      return res.status(404).json({ message: "banks not found" });
    }

    // Step 2: Delete the photo file if it exists
    if (banks.bankqr) {
      const bankfilePath = path.join(
        process.env.UPLOAD_BASE_PATH,
        "bank",
        banks.bankqr
      );
      fs.unlink(bankfilePath, (err) => {
        if (err) {
          console.error("Error deleting userimg file: ", err);
          return res
            .status(500)
            .json({ message: "Error deleting userimg file" });
        }
      });
    }

    // Step 3: Delete the user from the database
    const removed = await prisma.bank.delete({
      where: {
        id: Number(bankId),
      },
    });

    res.status(200).json({ message: "bank and image deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
