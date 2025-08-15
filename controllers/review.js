const prisma = require("../prisma/prisma");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validate input fields
    if (!productId) {
      return res.status(400).json({ message: "Invalid input fields" });
    }

    // Create new user in the database
    const newReview = await prisma.review.create({
      data: {
        productId: Number(productId),
        rating: rating ? Number(rating) : null,
        comment,
        userCode: req.user.code,
      },
    });

    res.json({
      message: "review created successfully!",
      data: newReview,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { productId } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        productId: Number(productId),
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
          },
        },
      },
    });

    const formatted = reviews.map((review) => ({
      ...review,
      createdAt: moment(review.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(review.updatedAt)
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
    const { reviewId } = req.params;

    const review = await prisma.review.findUnique({
      where: {
        id: Number(reviewId),
      },
    });

    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    const formatted = {
      ...review,
      createdAt: moment(review.createdAt)
        .tz("Asia/Vientiane")
        .format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(review.updatedAt)
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
    const { reviewId } = req.params;
    const { productId, rating, comment } = req.body;

    const updated = await prisma.review.update({
      where: {
        id: Number(reviewId),
      },
      data: {
        productId: Number(productId),
        rating: rating ? Number(rating) : null,
        comment,
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
    const { reviewId } = req.params;

    const removed = await prisma.review.delete({
      where: {
        id: Number(reviewId),
      },
    });

    res.status(200).json({ message: "chu deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
