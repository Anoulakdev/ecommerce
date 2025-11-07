const prisma = require("../prisma/prisma");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // ✅ 1. ดึงข้อมูล product ทั้งหมดที่มีใน body เพื่อตรวจสอบ shopId และ percent
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, shopId: true, percent: true },
    });

    if (products.length === 0) {
      return res.status(400).json({ message: "No valid products found" });
    }

    // ✅ 2. สร้าง map เพื่อเชื่อม productId → shopId และ percent
    const productMap = {};
    for (const p of products) {
      productMap[p.id] = {
        shopId: p.shopId,
        percent: p.percent ?? 0, // กันกรณี null
      };
    }

    // ✅ 3. Group สินค้าตาม shopId
    const groupedByShop = {};
    for (const item of items) {
      const productInfo = productMap[item.productId];
      if (!productInfo) continue; // ข้ามถ้า productId ไม่มีใน DB
      const shopId = productInfo.shopId;
      if (!groupedByShop[shopId]) groupedByShop[shopId] = [];
      groupedByShop[shopId].push({
        ...item,
        percent: productInfo.percent, // ✅ ดึง percent จาก product
      });
    }

    // ✅ 4. หาค่า order ล่าสุด
    const lastOrder = await prisma.order.findFirst({
      orderBy: { id: "desc" },
      select: { orderNo: true },
    });

    let lastNumber = 0;
    if (lastOrder?.orderNo) {
      const match = lastOrder.orderNo.match(/JPRL-(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1], 10);
      }
    }

    let orderCount = 0;
    const createdOrders = [];

    // ✅ 5. สร้าง order ตามแต่ละ shop
    for (const [shopId, shopItems] of Object.entries(groupedByShop)) {
      orderCount++;
      const newOrderNo =
        "JPRL-" + String(lastNumber + orderCount).padStart(10, "0");

      // ✅ คำนวณ grandtotal ของ shop นี้
      const grandTotal = shopItems.reduce(
        (sum, item) => sum + Number(item.totalprice),
        0
      );

      // ✅ สร้าง order พร้อม orderDetails หลายรายการ
      const newOrder = await prisma.order.create({
        data: {
          orderNo: newOrderNo,
          shopId: Number(shopId),
          userCode: req.user.code,
          grandtotalprice: grandTotal,
          orderDetails: {
            create: shopItems.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
              price: Number(item.price),
              totalprice: Number(item.totalprice),
              percent: Number(item.percent) || 0, // ✅ มาจาก product.percent แล้ว
            })),
          },
          orderStatuses: {
            create: [
              {
                productstatusId: 1, // สถานะเริ่มต้น เช่น Pending
                userCode: req.user.code,
              },
            ],
          },
        },
        include: {
          orderDetails: true,
          orderStatuses: true,
          shop: { select: { name: true } },
        },
      });

      createdOrders.push(newOrder);
    }

    res.json({
      message: "Orders created successfully!",
      data: createdOrders,
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
        currentStatusId: 1,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            tel: true,
            userCode: true,
          },
        },
        currentStatus: true,
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

exports.listCancel = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
        currentStatusId: 2,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            tel: true,
            userCode: true,
          },
        },
        currentStatus: true,
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

exports.listProcess = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userCode: req.user.code,
        NOT: {
          currentStatusId: {
            in: [1, 2], // ไม่เอา currentStatusId ที่เป็น 1 หรือ 2
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            tel: true,
            userCode: true,
          },
        },
        currentStatus: true,
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

exports.listFinish = async (req, res) => {
  try {
    // 1️⃣ ดึงสินค้าทั้งหมดของ user ที่สั่งสำเร็จ (status = 7)
    const products = await prisma.product.findMany({
      where: {
        orderDetails: {
          some: {
            order: {
              userCode: req.user.code,
              currentStatusId: 7,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        pimg: true,
        shop: {
          select: {
            id: true,
            name: true,
            tel: true,
            userCode: true,
          },
        },
        orderDetails: {
          select: {
            order: {
              select: {
                id: true,
                createdAt: true,
                currentStatusId: true,
              },
            },
          },
        },
      },
    });

    // 2️⃣ รวม product ที่ id เหมือนกัน เหลืออันเดียว (เลือก order ล่าสุด)
    const uniqueProductsMap = new Map();

    for (const product of products) {
      // หา order ล่าสุดของสินค้านั้น (ตาม createdAt หรือ id)
      const latestOrder = product.orderDetails
        .filter((d) => d.order?.currentStatusId === 7)
        .sort(
          (a, b) => new Date(b.order.createdAt) - new Date(a.order.createdAt)
        )[0];

      uniqueProductsMap.set(product.id, {
        ...product,
        latestOrderId: latestOrder?.order.id || 0,
        latestOrderDate:
          moment(latestOrder?.order.createdAt)
            .tz("Asia/Vientiane")
            .format("YYYY-MM-DD HH:mm:ss") || null,
      });
    }

    // 3️⃣ แปลง map เป็น array และเรียงตาม order ล่าสุด
    const uniqueProducts = Array.from(uniqueProductsMap.values()).sort(
      (a, b) => new Date(b.latestOrderDate) - new Date(a.latestOrderDate)
    );

    // 4️⃣ ส่งผลลัพธ์กลับ
    res.json(uniqueProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listSeller = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        shop: {
          user: {
            code: req.user.code, // ✅ filter user ผ่าน relation ของ shop
          },
        },
        currentStatusId: 1,
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
            gender: true,
            tel: true,
            code: true,
          },
        },
        currentStatus: true,
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

exports.sellerProcess = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        shop: {
          user: {
            code: req.user.code, // ✅ filter user ผ่าน relation ของ shop
          },
        },
        NOT: {
          currentStatusId: {
            in: [1], // ไม่เอา currentStatusId ที่เป็น 1 หรือ 2
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
            gender: true,
            tel: true,
            code: true,
          },
        },
        currentStatus: true,
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
        currentStatus: {
          select: {
            id: true,
            name: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            tel: true,
            userCode: true,
          },
        },
        orderDetails: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                pimg: true,
              },
            },
            quantity: true,
            price: true,
            totalprice: true,
          },
        },
        orderStatuses: {
          select: {
            productstatus: {
              select: {
                id: true,
                name: true,
              },
            },
            comment: true,
            payimg: true,
            user: {
              select: {
                id: true,
                code: true,
                firstname: true,
                lastname: true,
                gender: true,
                tel: true,
                code: true,
              },
            },
            createdAt: true,
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
      orderStatuses: order.orderStatuses.map((orderstatus) => ({
        ...orderstatus,
        createdAt: moment(orderstatus.createdAt)
          .tz("Asia/Vientiane")
          .format("YYYY-MM-DD HH:mm:ss"),
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
      prisma.orderStatus.deleteMany({ where: { orderId: Number(orderId) } }),
      prisma.orderDetail.deleteMany({ where: { orderId: Number(orderId) } }),
      prisma.order.delete({ where: { id: Number(orderId) } }),
    ]);

    res.status(200).json({ message: "order deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.reportAllOrder = async (req, res) => {
  try {
    const { datestart, dateend } = req.query;
    if (!datestart) {
      return res.status(400).json({ message: "datestart is required" });
    }
    if (!dateend) {
      return res.status(400).json({ message: "dateend is required" });
    }

    const startOfDate = new Date(`${datestart}T00:00:00+07:00`);
    const endOfDate = new Date(`${dateend}T23:59:59+07:00`);

    const orders = await prisma.orderDetail.findMany({
      where: {
        order: {
          orderStatuses: {
            some: {
              productstatusId: 7,
              createdAt: {
                gte: startOfDate,
                lte: endOfDate,
              },
            },
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
            shopId: true,
            shop: {
              select: {
                id: true,
                name: true,
                tel: true,
                user: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    gender: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // ✅ Group by shopId + productId + price + percent
    const grouped = {};

    for (const item of orders) {
      if (!item.product || !item.product.shopId) continue;

      const shopId = item.product.shopId;
      const productId = item.product.id;
      const price = Number(item.price ?? 0);
      const percent = Number(item.percent ?? 0);
      const key = `${productId}_${price}_${percent}`;

      if (!grouped[shopId]) {
        grouped[shopId] = {
          shop: item.product.shop,
          products: {},
        };
      }

      if (!grouped[shopId].products[key]) {
        const totalprice = Number(item.totalprice ?? 0);
        const divide = totalprice * (percent / 100);

        grouped[shopId].products[key] = {
          productId,
          title: item.product.title,
          pimg: item.product.pimg,
          price,
          percent,
          quantity: Number(item.quantity ?? 0),
          totalprice,
          divide,
        };
      } else {
        const existing = grouped[shopId].products[key];
        existing.quantity += Number(item.quantity ?? 0);
        existing.totalprice += Number(item.totalprice ?? 0);
        existing.divide += Number(item.totalprice ?? 0) * (percent / 100);
      }
    }

    // ✅ รวมยอดแต่ละร้าน
    const result = Object.values(grouped).map((shopGroup) => {
      const products = Object.values(shopGroup.products).sort(
        (a, b) => a.productId - b.productId
      );

      const shopTotal = products.reduce(
        (sum, p) => sum + Number(p.totalprice),
        0
      );

      const shopDivide = products.reduce((sum, p) => sum + Number(p.divide), 0);

      return {
        shop: shopGroup.shop,
        products,
        shopTotal, // ยอดรวมก่อนหัก
        shopDivide, // ส่วนแบ่งที่ต้องจ่าย
      };
    });

    res.json(result);
  } catch (err) {
    console.error("🔥 Error listEcommerce:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.reportShopOrder = async (req, res) => {
  try {
    const { datestart, dateend } = req.query;
    if (!datestart) {
      return res.status(400).json({ message: "datestart is required" });
    }
    if (!dateend) {
      return res.status(400).json({ message: "dateend is required" });
    }

    const startOfDate = new Date(`${datestart}T00:00:00+07:00`);
    const endOfDate = new Date(`${dateend}T23:59:59+07:00`);

    const shop = await prisma.user.findUnique({
      where: { code: req.user.code },
      include: {
        shop: { select: { id: true } },
      },
    });

    const shopId = shop?.shop?.id || null;

    const orders = await prisma.orderDetail.findMany({
      where: {
        order: {
          shopId: shopId,
          orderStatuses: {
            some: {
              productstatusId: 7,
              createdAt: {
                gte: startOfDate,
                lte: endOfDate,
              },
            },
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            pimg: true,
          },
        },
      },
    });

    // ✅ Group by productId + price + percent
    const grouped = {};

    for (const item of orders) {
      const productId = item.product.id;
      const price = Number(item.price ?? 0);
      const percent = Number(item.percent ?? 0);
      const key = `${productId}_${price}_${percent}`;

      if (!grouped[key]) {
        const totalprice = Number(item.totalprice ?? 0);
        const divide = totalprice * (percent / 100);
        grouped[key] = {
          productId,
          title: item.product.title,
          pimg: item.product.pimg,
          price,
          percent,
          quantity: Number(item.quantity ?? 0),
          totalprice,
          divide,
        };
      } else {
        const existing = grouped[key];
        existing.quantity += Number(item.quantity ?? 0);
        existing.totalprice += Number(item.totalprice ?? 0);
        existing.divide += Number(item.totalprice ?? 0) * (percent / 100);
      }
    }

    // ✅ แปลงเป็น array + sort ตาม productId ASC
    const products = Object.values(grouped).sort(
      (a, b) => a.productId - b.productId
    );

    // ✅ รวมยอดทั้งหมดของร้าน
    const shopTotal = products.reduce((sum, p) => sum + p.totalprice, 0);
    const shopDivide = products.reduce((sum, p) => sum + p.divide, 0);

    res.json({
      products,
      shopTotal,
      shopDivide,
    });
  } catch (err) {
    console.error("🔥 Error reportShopOrder:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
