// const User = require("../../models/userModel");
import User from "../../models/userModel";
// const Product = require("../../models/productModel");
import Product from "../../models/productModel";
// const Cart = require("../../models/cartModel");
import Cart from "../../models/cartModel";
// const Order = require("../../models/orderModel");
import Order from "../../models/orderModel";
// const uniqid = require("uniqid");
import uniqid from "uniqid";

// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";
// const validateMongoDbId = require("../../utils/validateMongodbId");
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";
import { instance } from "../../utils/rajorpayInstance";

const payOnDeliveryOrder = asyncHandler(async (req: Req_with_user, res) => {
  const { receipt, notes, address, couponApplied } = req.body;
  const _id = req.user?._id;
  let { populate = "" } = req.query;
  if (
    populate != "products.product" &&
    populate != "user" &&
    populate != "address"
  ) {
    populate = "";
  }
  if (!address || !receipt || !notes || !_id) {
    throw new Error("Create cash order failed");
  }
  // else {
  try {
    validateMongoDbId(_id);
    // const user = await User.findById(_id);
    let userCart = await Cart.find({ user: _id });
    const ids = userCart?.map((item) => item.product);
    let finalAmout = 0;
    const productsToOrder = await Product.find(
      { _id: { $in: ids } },
      "quantity price"
    );
    //## checking ordering quantity is available in stock or not
    for (const itemToOrder of userCart) {
      const stock = productsToOrder.find(
        (item) => item._id.toString() === itemToOrder?.product?.toString()
      );

      if (!stock || !stock.quantity || !stock.price || !itemToOrder?.quantity) {
        throw new Error("quantity not found");
      }

      if (itemToOrder.quantity > stock?.quantity) {
        // res.status(400).json({ message: "product already sold out" });
        throw new Error("product already sold out");
      }

      finalAmout = finalAmout + stock.price * 100 * itemToOrder.quantity;
    }

    let newOrder = await new Order({
      products: userCart,
      address,
      paymentMode: "COD",
      paymentIntent: {
        id: uniqid(),
        amount: finalAmout,
        amount_paid: 0,
        amount_due: finalAmout,
        status: "created",
        method: "COD",
        created_at: Date.now(),
        currency: "INR",
        notes,
        receipt,
      },
      user: _id,
      orderStatus: "Processing",
    }).save();
    let update = userCart.map((item) => {
      if (!item.quantity)
        throw new Error("something went wrong quantity undefind ");
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Product.bulkWrite(update, {});
    res.json(
      populate
        ? await newOrder.populate(populate as string | string[])
        : newOrder
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const payNowOrder = asyncHandler(async (req: Req_with_user, res) => {
  const { receipt, notes, address, couponApplied } = req.body;
  const _id = req.user?._id;
  let { populate = "" } = req.query;
  if (
    populate != "products.product" &&
    populate != "user" &&
    populate != "address"
  ) {
    populate = "";
  }

  if (!address || !receipt || !notes || !_id) {
    throw new Error("Create cash order failed");
  }
  try {
    validateMongoDbId(_id);

    let userCart = await Cart.find({ user: _id });
    const ids = userCart?.map((item) => item.product);
    let finalAmout = 0;
    const productsToOrder = await Product.find(
      { _id: { $in: ids } },
      "quantity price"
    );
    //## checking ordering quantity is available in stock or not
    for (const itemToOrder of userCart) {
      const stock = productsToOrder.find(
        (item) => item._id.toString() === itemToOrder?.product?.toString()
      );

      if (!stock || !stock.quantity || !stock.price || !itemToOrder?.quantity) {
        throw new Error("quantity not found");
      }

      if (itemToOrder.quantity > stock?.quantity) {
        res.status(400).json({ message: "product already sold out" });
        throw new Error("product already sold out");
      }

      finalAmout = finalAmout + stock.price * 100 * itemToOrder.quantity;
    }

    const paymentIntent = await instance.orders.create({
      amount: finalAmout,
      currency: "INR",
      receipt,
      notes,
    });

    const newOrder = await new Order({
      products: userCart,
      paymentIntent: {
        ...paymentIntent,
        amount_paid: 0,
        amount_due: finalAmout,
        status: "created",
        method: "COD",
        created_at: Date.now(),
      },
      paymentMode: "RAZORPAY",
      address,
      user: _id,
      orderStatus: "Processing",
    }).save();

    let update = userCart.map((item) => {
      if (!item.quantity)
        throw new Error("something went wrong quantity undefind ");
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Product.bulkWrite(update, {});
    res.json(
      populate
        ? await newOrder.populate(populate as string | string[])
        : newOrder
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getOrdersByUser = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    let { _id } = req.user;
    const { id: param_id } = req.params;
    let { populate = "" } = req.query;
    if (
      populate != "products.product" &&
      populate != "user" &&
      populate != "address"
    ) {
      populate = "";
    }
    _id = _id || param_id; //|| (query_id as string);
    try {
      validateMongoDbId(_id);
      if (populate) {
        const userorders = await Order.find({ user: _id }).populate(
          populate as string | string[]
        );
        res.json(userorders);
      } else {
        const userorders = await Order.find({ user: _id });
        res.json(userorders);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

const getAllOrders = asyncHandler(async (req, res) => {
  let { populate = "" } = req.query;
  if (
    populate != "products.product" &&
    populate != "user" &&
    populate != "address"
  ) {
    populate = "";
  }
  try {
    if (populate) {
      const alluserorders = await Order.find().populate(
        populate as string | string[]
      ); //.exec();
      res.json(alluserorders);
    } else {
      const alluserorders = await Order.find();
      res.json(alluserorders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let { populate = "" } = req.query;
  if (
    populate != "products.product" &&
    populate != "user" &&
    populate != "address"
  ) {
    populate = "";
  }
  try {
    validateMongoDbId(id);
    if (populate) {
      const userorders = await Order.find({ _id: id }).populate(
        populate as string | string[]
      ); //.exec();
      res.json(userorders);
    } else {
      const userorders = await Order.find({ _id: id });
      res.json(userorders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  let { id } = req.params;
  let { populate = "" } = req.query;
  if (
    populate != "products.product" &&
    populate != "user" &&
    populate != "address"
  ) {
    populate = "";
  }
  try {
    validateMongoDbId(id);
    if (populate) {
      const updateOrderStatus = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      }).populate(populate as string | string[]);
      res.json(updateOrderStatus);
    } else {
      const updateOrderStatus = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updateOrderStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export {
  payOnDeliveryOrder,
  payNowOrder,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
};
