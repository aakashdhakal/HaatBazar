"use server";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
	},
	category: {
		type: String,
		required: true,
	},
	countInStock: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		default: 0,
	},
	numReviews: {
		type: Number,
		default: 0,
	},
	quantityPrice: {
		type: String,
	},
});

const Product =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
