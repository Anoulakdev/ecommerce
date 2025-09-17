const prisma = require("../prisma/prisma");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // 1. หา order ล่าสุดจาก DB (เอา orderNo ที่มากที่สุด)
    const lastOrder = await prisma.order.findFirst({
      orderBy: {
        id: "desc", // ใช้ id ล่าสุด หรือถ้าอยากใช้ orderNo จริงๆ ต้อง sort ตาม orderNo
      },
      select: { orderNo: true },
    });

    // 2. ดึงเลขลำดับออกมา
    let lastNumber = 0;
    if (lastOrder && lastOrder.orderNo) {
      // orderNo เป็น JPRL-0000000010 → ดึงเลขหลัง '-'
      const match = lastOrder.orderNo.match(/JPRL-(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1], 10);
      }
    }

    // 3. สร้าง order ใหม่ตามจำนวน items
    const orders = await Promise.all(
      items.map((item, index) =>
        prisma.order.create({
          data: {
            orderNo: "JPRL-" + String(lastNumber + index + 1).padStart(10, "0"),
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                code: true,
                tel: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                code: true,
                tel: true,
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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                code: true,
                tel: true,
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

exports.listFinish = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
        orderDetails: {
          some: {
            productstatusId: 7,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                code: true,
                tel: true,
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
        },
        // orderDetails: {
        //   orderBy: { id: "desc" }, // ล่าสุดก่อน
        //   take: 1,
        //   include: { productstatus: true },
        // },
      },
    });

    // กรองเฉพาะ order แรกของแต่ละ productId
    const uniqueOrdersMap = new Map();
    orders.forEach((order) => {
      if (!uniqueOrdersMap.has(order.productId)) {
        uniqueOrdersMap.set(order.productId, order);
      }
    });
    const uniqueOrders = Array.from(uniqueOrdersMap.values());

    // แปลง format วันที่
    const formatted = uniqueOrders.map((order) => ({
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
            tel: true,
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

exports.sellerProcess = async (req, res) => {
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
            tel: true,
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
    const excluded = [1];
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

exports.listEcommerce = async (req, res) => {
  try {
    // ดึง order พร้อม orderDetails ล่าสุดเท่านั้น
    const orders = await prisma.order.findMany({
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            code: true,
            tel: true,
            unit: { select: { name: true } },
            chu: { select: { name: true } },
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
          take: 1, // เอาเฉพาะล่าสุด
          include: { productstatus: true },
        },
      },
    });

    // filter order ที่ productstatusId ล่าสุดอยู่ใน 4-7
    const filtered = orders.filter(
      (order) =>
        order.orderDetails.length > 0 &&
        [4, 5, 6, 7].includes(order.orderDetails[0].productstatusId)
    );

    // map format
    const formatted = filtered.map((order) => {
      const totalPrice = Number(order.totalprice) || 0;
      const discount = totalPrice * 0.05; // 5%
      const finalPrice = totalPrice - discount;

      return {
        ...order,
        discount: discount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        createdAt: moment(order.createdAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(order.updatedAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.ecomSendMoney = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderDetails: {
          some: {
            productstatusId: 8,
          },
        },
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
            tel: true,
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

    const formatted = orders.map((order) => {
      const totalPrice = Number(order.totalprice) || 0;
      const discount = totalPrice * 0.05; // 5%
      const finalPrice = totalPrice - discount;

      return {
        ...order,
        discount: discount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        createdAt: moment(order.createdAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(order.updatedAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

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
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
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
