"use server";
import { dbConnect } from "@/lib/db";
import Product from "@/modals/productModal";

export default async function getAllProducts() {
	await dbConnect();

	try {
		const products = await Product.find({});
		//convert this to plain object and convert _id to string
		return products.map((product) => ({
			...product.toObject(),
			_id: product._id.toString(),
		}));
	} catch (error) {
		console.error("Error fetching products:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
			status: 500,
		});
	}
}

export async function getProductById(id) {
	console.log("getProductById", id);
	await dbConnect();
	try {
		const product = await Product.findById(id);
		if (!product) {
			return { error: "Product not found", status: 404 };
		}
		return {
			...product.toObject(),
			_id: product._id.toString(),
		};
	} catch (error) {
		console.error("Error fetching product:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch product" }), {
			status: 500,
		});
	}
}
