import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: { type: [String], required: true },
  category: { type: String, required: true },
  discountedPrice: Number,
  quantity: Number,
  sizes: [String],
  colors: [String],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
