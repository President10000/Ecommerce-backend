"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose"); // Erase if already required
const mongoose_1 = require("mongoose");
// const bcrypt = require("bcrypt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
// const user=
var userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        minLength: 10,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 100,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    // cart: {
    //   type: Array,
    //   default: [],
    // },
    // address: [[{ lable: String, value: String }]],
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
}); //as UserSchema;
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcrypt_1.default.genSaltSync(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        next();
    });
});
// userSchema
userSchema.methods.isPasswordMatched = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enteredPassword, this.password);
    });
};
userSchema.methods.createPasswordResetToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const resettoken = crypto_1.default.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(resettoken)
            .digest("hex");
        this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
        return resettoken;
    });
};
//Export the model
exports.default = (0, mongoose_1.model)("User", userSchema);
