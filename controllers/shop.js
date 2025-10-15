const prisma = require("../prisma/prisma");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  try {
    const { name, tel } = req.body;

    // Validate input fields
    if (!name) {
      return res.status(400).json({ message: "Invalid input fields" });
    }

    const checkShop = await prisma.shop.findUnique({
      where: { userCode: req.user.code },
    });
    if (checkShop) {
      return res.status(409).json({ message: "UserCode already exists" });
    }

    // Create new user in the database
    const newShop = await prisma.shop.create({
      data: {
        name,
        tel,
        userCode: req.user.code,
      },
    });

    res.json({
      message: "Shop created successfully!",
      data: newShop,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        userCode: req.user.code,
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
            gender: true,
          },
        },
      },
    });

    const formattedUsers = shops.map((shop) => ({
      ...shop,
      createdAt: moment(shop.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(shop.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: {
        id: Number(shopId),
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
            gender: true,
          },
        },
      },
    });

    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }

    const formatted = {
      ...shop,
      createdAt: moment(shop.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(shop.updatedAt)
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
  try {
    const { shopId } = req.params;
    const { name, tel } = req.body;

    const updated = await prisma.shop.update({
      where: {
        id: Number(shopId),
      },
      data: {
        name: name,
        tel: tel,
      },
    });

    res.json({ message: "Updated Success!! ", data: updated });
  } catch (err) {
    // err
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { shopId } = req.params;

    const removed = await prisma.shop.delete({
      where: {
        id: Number(shopId),
      },
    });

    res.status(200).json({ message: "shop deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listapproved = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
            gender: true,
            unit: {
              select: {
                name: true,
              },
            },
            chu: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedUsers = shops.map((shop) => ({
      ...shop,
      createdAt: moment(shop.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(shop.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.actionapproved = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { approved } = req.body;

    // Step 1: Find the user to update
    const shop = await prisma.shop.findUnique({
      where: {
        id: Number(shopId),
      },
    });

    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }

    const updated = await prisma.shop.update({
      where: {
        id: Number(shopId),
      },
      data: {
        approved: Number(approved),
      },
    });

    res.json({ message: "Update successful!", data: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
