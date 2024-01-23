const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  if (!email) {
    res.json(404).json({ message: "Invalid Credentials" });
  }
  /**
   * TODO:With the help of email find the user exists or not
   */

  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    // throw new Error("User Already Exists");
    res.json(400).json({ message: "User Already Exists" });
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  if ((email, password)) {
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      res.status(404).json({ message: "Invalid Credentials" });
    }
  } else {
    res.status(404).json({ message: "body not found" });
  }
});

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  if (email && password) {
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") {
      res.status(404).json({ message: "you are not allowed" });
    } else if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      res.status(404).json({ message: "Invalid Credentials" });
    }
  } else {
    res.status(404).json({ message: "body not found" });
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save user Address

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { phone_no, zipcode } = req.body;
  if (!zipcode || !phone_no) {
    res.status(400).json({ message: `zipcode and phone no is required ` });
  }
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id is not valid" });
  }
  try {
    let newAddress = await new Address( { ...req.body, user: _id },).save();
    res.json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { address } = req.body;
  const { phone_no, zipcode } = address;

  if (!zipcode || !phone_no) {
    res.status(400).json({ message: `zipcode and phone no is required ` });
  }
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id is not valid" });
  }
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.body._id },
      address,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.query;
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id is not valid" });
  }
  try {
    const updated = await Address.findByIdAndDelete(id);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { user } = req.query;
  if (!user) {
    res.status(404).json({ message: "body not found" });
  }
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id is not valid" });
  }
  try {
    const updated = await Address.find({ user });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { populate } = req.query;
  const { _id } = req.user;
  try {
    const wishlist = await User.findById(_id, "wishlist").populate(
      populate ? populate : ""
    );
    res.json(wishlist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

async function putItemToCart(existingCart, itemsToInsert) {
  let cartTotal = 0;
  for (let i = 0; i < itemsToInsert.length; i++) {
    if (
      existingCart.some(
        (item) => item.product.toString() === itemsToInsert[i]._id
      )
    ) {
      for (let item of existingCart) {
        if (item.product.toString() === itemsToInsert[i]._id) {
          item.count += itemsToInsert[i].count ? itemsToInsert[i].count : 1;
        }
      }
    } else {
      let object = {};
      object.product = itemsToInsert[i]._id;
      let getPrice = await Product.findById(itemsToInsert[i]._id)
        .select("price")
        .exec();
      object.price = parseInt(getPrice.price);
      object.count = itemsToInsert[i].count ? itemsToInsert[i].count : 1;
      existingCart.push(object);
    }
  }
  for (let i = 0; i < existingCart.length; i++) {
    cartTotal = cartTotal + existingCart[i].price * existingCart[i].count;
  }
  return { products: existingCart, cartTotal };
}

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user id is not valid" });
  }
  try {
    // let products = [];
    const user = await User.findById(_id, { _id });
    // check if user already have product in cart
    if (!user._id) {
      res.status(404).json({ message: "user not found" });
    }

    const alreadyExistCart = await Cart.findOne({ user: user._id });
    if (alreadyExistCart?._id) {
      const { products, cartTotal } = await putItemToCart(
        [...alreadyExistCart.products],
        cart
      );
      const updated = await Cart.findOneAndUpdate(
        { _id: alreadyExistCart._id },
        { products, cartTotal },
        { new: true }
      ).populate("products.product");
      res.json(updated);
    } else {
      const { products, cartTotal } = await putItemToCart([], cart);
      let newCart = await new Cart({
        products,
        cartTotal: cartTotal,
        user: user?._id,
      }).save();
      res.json(newCart);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user not found" });
  }
  try {
    const cart = await Cart.findOne({ user: _id }).populate("products.product");
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const removeItemFromUserCart = asyncHandler(async (req, res) => {
  const { toRemove } = req.body;
  const { _id } = req.user;

  if (!validateMongoDbId(_id)) {
    res.status(404).json({ message: "user not found" });
  }
  try {
    const existingCart = await Cart.findOne({ user: _id });
    const filtered = existingCart.products.filter((item) => {
      return !toRemove.some((id) => id === item.product.toString());
    });

    let cartTotal = 0;
    for (let i = 0; i < filtered.length; i++) {
      cartTotal = cartTotal + filtered[i].price * filtered[i].count;
    }

    const updated = await Cart.findOneAndUpdate(
      { _id: existingCart._id },
      { products: filtered, cartTotal },
      { new: true }
    ).populate("products.product");
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ user: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
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
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});
const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  updateAddress,
  deleteAddress,
  getAddress,
  userCart,
  removeItemFromUserCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
};
