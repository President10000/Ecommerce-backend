import Product from "../../models/productModel";
import Cart from "../../models/cartModel";
import Order from "../../models/orderModel";
import uniqid from "uniqid";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";
import { instance } from "../../utils/rajorpayInstance";

const payOnDeliveryOrder = asyncHandler(async (req: Req_with_user, res) => {
  const { receipt, notes, address } = req.body;
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
  res.json(await newOrder.populate({ path: populate, strictPopulate: false }));
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
  res.json(await newOrder.populate({ path: populate, strictPopulate: false }));
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
    _id = _id || param_id;
    validateMongoDbId(_id);
    const userorders = await Order.find({ user: _id }).populate({
      path: populate,
      strictPopulate: false,
    });
    res.json(userorders);
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
  const alluserorders = await Order.find().populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(alluserorders);
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
  validateMongoDbId(id);
  const userorders = await Order.find({ _id: id }).populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(userorders);
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
  validateMongoDbId(id);
  const updateOrderStatus = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate({ path: populate, strictPopulate: false });
  res.json(updateOrderStatus);
});

export {
  payOnDeliveryOrder,
  payNowOrder,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
};
