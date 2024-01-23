const expressAsyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const validateMongoDbId = require("../utils/validateMongodbId");
const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
// const uniqid = require("uniqid");

var instance = new Razorpay({
  key_id: "rzp_test_0VIkjqfMFMpUYa",
  key_secret: "JUfMDHke6OvgPF0AcnhzR6Sy",
});

const createOrder = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { receipt, notes, couponApplied,address } = req.body;

  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id not valid" });
    throw new Error("user id not valid");
  }

  if (!receipt || !notes) {
    res.status(404).json({ message: "recipt and notes are required" });
    throw new Error("recipt and notes are required");
  }

  try {
    const user = await userModel.findById(_id);
    let userCart = await cartModel.findOne({ user: user._id });
    const ids = userCart.products.map((item) => item.product);

    const productsToOrder = await productModel.find(
      { _id: { $in: ids } },
      "quantity"
    );
    //## checking ordering quantity is available in stock or not
    for (const itemToOrder of userCart.products) {
      const stock = productsToOrder.find(
        (item) => item._id.toString() === itemToOrder.product.toString()
      );
      if (itemToOrder.count > stock?.quantity || !stock) {
        // res.status(400).json({ message: "product already sold out" });
        throw new Error("product already sold out");
      }
    }

    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    instance.orders.create(
      { amount: finalAmout, currency: "INR", receipt, notes },
      async (err, order) => {
        if (!err?.error) {
         const created= await new orderModel({
            products: userCart.products,
            paymentIntent: order,
            paymentMode:"RAZORPAY",
            address,
            orderby: user._id,
            orderStatus: "Processing",
          }).save();

          let update = userCart.products.map((item) => {
            return {
              updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
              },
            };
          });
          await productModel.bulkWrite(update, {});

          res.json(created);
        } else {
          res.status(400).json({ message: err.error.description });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { createOrder };
