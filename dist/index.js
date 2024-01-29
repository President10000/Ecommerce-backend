"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const bodyParser = require("body-parser");
const body_parser_1 = __importDefault(require("body-parser"));
// const express = require("express");
const express_1 = __importDefault(require("express"));
// const dbConnect = require("./config/dbConnect");
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// const dotenv = require("dotenv").config();
const dotenv_1 = __importDefault(require("dotenv"));
// const userRouter = require("./routes/user/userRoute");
const userRoute_1 = __importDefault(require("./routes/user/userRoute"));
// const productRouter = require("./routes/productRoute");
const productRoute_1 = __importDefault(require("./routes/productRoute"));
// const searchRouter = require("./routes/searchRoute");
const searchRoute_1 = __importDefault(require("./routes/searchRoute"));
// const blogRouter = require("./routes/blogRoute");
// const categoryRouter = require("./routes/prodcategoryRoute");
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
const enqRoute_1 = __importDefault(require("./routes/enqRoute"));
// const couponRouter = require("./routes/couponRoute");
// const imageRoute = require("./routes/imageRoute");
const imageRoute_1 = __importDefault(require("./routes/imageRoute"));
// const razorpay = require("./routes/razorpay");
// const cookieParser = require("cookie-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const morgan = require("morgan");
const morgan_1 = __importDefault(require("morgan"));
// const cors = require("cors");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
(0, dbConnect_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)( /*{
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allowed: boolean) => void
  ) => {
    if (origin) {
      const allowedOrigins = [
        "https://techtreasure.vercel.app",
        "https://raiappliances-admin-panel.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
      ];
      callback(null, allowedOrigins.indexOf(origin) !== -1);
    } else {
      callback(new Error("Invalid origin"), false);
    }
  },
  credentials: true,
}*/));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.use("/api/user", userRoute_1.default);
app.use("/api/product", productRoute_1.default);
app.use("/api/search", searchRoute_1.default);
app.use("/api/image", imageRoute_1.default);
app.use("/api/enquiry", enqRoute_1.default);
// app.use("/api/razorpay", razorpay);
// app.use("/api/blog", blogRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
// app.use("/api/brand", brandRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/color", colorRouter);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
});
