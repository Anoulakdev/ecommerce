const prisma = require("../prisma/prisma");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const orders = await Promise.all(
      items.map((item, index) =>
        prisma.order.create({
          data: {
            orderNo: "JPRL-" + String(index + 1).padStart(10, "0"),
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
            totalprice: Number(item.totalprice),
            userCode: req.user.code,
            orderDetails: {
              create: {
                userCode: req.user.code,
                productstatusId: 1,
              },
            },
          },
          include: { orderDetails: true },
        })
      )
    );

    res.json({
      message: "Orders created successfully!",
      data: orders,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.listOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            code: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
        orderDetails: {
          orderBy: { id: "desc" }, // ล่าสุดก่อน
          take: 1,
          include: { productstatus: true },
        },
      },
    });

    // filter ฝั่งโค้ด
    const filteredOrders = orders.filter(
      (order) => order.orderDetails[0]?.productstatusId === 1
    );

    const formatted = filteredOrders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(order.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listCancel = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            code: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
        orderDetails: {
          orderBy: { id: "desc" }, // ล่าสุดก่อน
          take: 1,
          include: { productstatus: true },
        },
      },
    });

    // filter ฝั่งโค้ด
    const filteredOrders = orders.filter(
      (order) => order.orderDetails[0]?.productstatusId === 2
    );

    const formatted = filteredOrders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(order.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listProcess = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            code: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
        orderDetails: {
          orderBy: { id: "desc" }, // ล่าสุดก่อน
          take: 1,
          include: { productstatus: true },
        },
      },
    });

    // filter ฝั่งโค้ด
    const excluded = [1, 2];
    const filteredOrders = orders.filter(
      (order) => !excluded.includes(order.orderDetails[0]?.productstatusId)
    );

    const formatted = filteredOrders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(order.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listSeller = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        product: { userCode: req.user.code },
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            code: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
        orderDetails: {
          orderBy: { id: "desc" }, // ล่าสุดก่อน
          take: 1,
          include: { productstatus: true },
        },
      },
    });

    const formatted = orders.map((order) => ({
      ...order,
      createdAt: moment(order.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(order.updatedAt)
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
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: Number(orderId),
      },
      include: {
        orderDetails: {
          orderBy: { id: "desc" }, // ล่าสุดก่อน
          include: {
            productstatus: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const formatted = {
      ...order,
      createdAt: moment(order.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(order.updatedAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      orderDetails: order.orderDetails.map((detail) => ({
        ...detail,
        createdAt: moment(detail.createdAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
        paydate: detail.paydate
          ? moment(detail.paydate)
              .tz("Asia/Vientiane")
              .format("YYYY-MM-DD HH:mm:ss")
          : null,
      })),
    };

    res.json(formatted);
  } catch (err) {
    // err
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { orderId } = req.params;

    await prisma.$transaction([
      prisma.orderDetail.deleteMany({ where: { orderId: Number(orderId) } }),
      prisma.order.delete({ where: { id: Number(orderId) } }),
    ]);

    res.status(200).json({ message: "order deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
