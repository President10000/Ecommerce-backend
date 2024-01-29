import mongoose from "mongoose";

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
      // required: true,
    },
    local_price: {
      // required: true,
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
    table: [{ head: String, rows: [String] }],
    meta_data: [
      {
        key: String,
        value: String,
      },
    ],

    category: {
      primary: {
        type: String,
        // required: true,
        // minLength: 3,
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
      // required: true,
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
    is_cod_availabe: Boolean,
    policy: {
      exchange: { status: Boolean, validity: Number },
      return_or_refund: { status: Boolean, validity: Number },
      description: String,
      rules: [String],
    },
    terms_and_conditions: [String],
    featured_on: [String],
    as_draft: { type: Boolean, default: true },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Product", productSchema);
