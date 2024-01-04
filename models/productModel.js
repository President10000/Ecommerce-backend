const mongoose = require("mongoose"); 

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 500,
    },
    price: {
      type: Number,
      required: true,
    },
    local_price: {
      required: true,
      type: Number,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minLength: 6,
    },
    description: {
      head_desc: {
        type: String,
      },
      sub_desc: [
        {
          key: String,
          value: String,
        },
      ],
    },
    meta_data: [
      {
        key: String,
        value: String,
      },
    ],

    category: {
      primary: {
        type: String,
        required: true,
        minLength: 3,
      },
      secondry: [String],
    },
    sizes: [
      {
        qty: Number,
        size: String,
      },
    ],
    brand: {
      type: String,
      minLength: 1,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      primary: [
        {
          public_id: String,
          asset_id: String,
          url: String,
        },
      ],
      descriptive: [
        {
          public_id: String,
          asset_id: String,
          url: String,
        },
      ],
    },
    colors: [
      {
        qty: Number,
        color: String,
      },
    ],
    tags: [String],
    policy: {
      exchange: { status: Boolean, validity: Number },
      return_or_refund: { status: Boolean, validity: Number },
      description: String,
      rules: [String],
    },
    terms_and_conditions: [String],
    featured_on: [String],
    // feedback: {
    //   summery: {
    //     total_rating: { type: Number, default: 0 },
    //     avarage_rating: { type: Number, default: 0 },
    //     total_comment: { type: Number, default: 0 },
    //   },
    //   data: [
    //     {
    //       images: [
    //         {
    //           public_id: String,
    //           asset_id: String,
    //           url: String,
    //           date: {
    //             created: Date,
    //             updated: Date,
    //           },
    //         },
    //       ],
    //       comment: {
    //         value: String,
    //         date: {
    //           created: Date,
    //           updated: Date,
    //         },
    //       },

    //       rating: {
    //         value: Number,
    //         date: {
    //           created: Date,
    //           updated: Date,
    //         },
    //       },

    //       postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     },
    //   ],
    // },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
