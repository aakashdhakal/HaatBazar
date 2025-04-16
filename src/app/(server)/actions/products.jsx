"use server";
import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { uploadImage, deleteImage } from "@/lib/utils";

export default async function getAllProducts() {
	await dbConnect();

	try {
		const products = await Product.find({});
		//convert this to plain object and convert _id to string
		return products.map((product) => ({
			...product.toObject(),
			category: product.category,
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

export async function createProduct(data) {
	await dbConnect();
	try {
		console.log("Data received in createProduct:", data); // Debugging line

		// Upload the product image if provided
		if (data.image && typeof data.image !== "string") {
			const imagePath = await uploadImage(data.image, data.name);
			data.image = imagePath; // Replace the File object with the file path
		}

		// Create the product with the updated data
		const product = await Product.create(data);

		return {
			...product.toObject(),
			_id: product._id.toString(),
		};
	} catch (error) {
		console.error("Error creating product:", error);
		return new Response(JSON.stringify({ error: "Failed to create product" }), {
			status: 500,
		});
	}
}

export async function updateProduct(id, data) {
	await dbConnect();
	try {
		if (data.image && typeof data.image !== "string") {
			// If there's an existing image, delete it first
			const oldImagePath = await Product.findById(id).select("image");
			if (oldImagePath && oldImagePath.image) {
				await deleteImage(oldImagePath.image); // Delete the old image from the server
			}
			const imagePath = await uploadImage(data.image, data.name);
			data.image = imagePath; // Replace the File object with the file path
		}
		const product = await Product.findByIdAndUpdate(id, data, { new: true });
		if (!product) {
			return { error: "Product not found", status: 404 };
		}
		return {
			...product.toObject(),
			_id: product._id.toString(),
		};
	} catch (error) {
		console.error("Error updating product:", error);
		return new Response(JSON.stringify({ error: "Failed to update product" }), {
			status: 500,
		});
	}
}

export async function deleteProduct(id) {
	await dbConnect();
	try {
		const product = await Product.findByIdAndDelete(id);
		await deleteImage(product.image); // Delete the image from the server
		if (!product) {
			return { error: "Product not found", status: 404 };
		}
		return {
			message: "Product deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting product:", error);
		return new Response(JSON.stringify({ error: "Failed to delete product" }), {
			status: 500,
		});
	}
}

export async function decreaseOrderStock(orderItems) {
	await dbConnect();

	try {
		// Convert single item to array for consistent processing
		const items = Array.isArray(orderItems) ? orderItems : [orderItems];

		// Create bulk operations for efficient updates
		const bulkOps = items.map((item) => ({
			updateOne: {
				filter: {
					_id: item.product, // Product ID
					countInStock: { $gte: item.quantity }, // Ensure sufficient stock
				},
				update: {
					$inc: { countInStock: -item.quantity }, // Atomically decrement
				},
			},
		}));

		// Execute all updates in a single operation
		const result = await Product.bulkWrite(bulkOps);

		// Check if all updates were successful
		if (result.modifiedCount < items.length) {
			const failedCount = items.length - result.modifiedCount;
			return {
				success: false,
				message: `${failedCount} product(s) had insufficient stock or weren't found`,
				updatedCount: result.modifiedCount,
			};
		}
		return {
			success: true,
			message: `Stock decreased for ${result.modifiedCount} products`,
			updatedCount: result.modifiedCount,
		};
	} catch (error) {
		console.error("Error decreasing product stock:", error);
		return {
			success: false,
			error: "Failed to update product stock",
			details: error.message,
		};
	}
}

export async function getProductsByCategory(category) {
	await dbConnect();
	try {
		// Create a regex pattern that:
		// 1. Ignores case sensitivity (i flag)
		// 2. Makes the trailing 's' optional to handle singular/plural
		// We'll also remove any hyphens and replace with spaces for slug compatibility
		const searchCategory = category.replace(/-/g, " ");

		// This pattern handles both singular and plural forms:
		// - If category ends with 's', it matches the exact plural or without the 's'
		// - If category doesn't end with 's', it matches the exact singular or with 's' added
		const regexPattern = searchCategory.endsWith("s")
			? `^${searchCategory}$|^${searchCategory.slice(0, -1)}$`
			: `^${searchCategory}$|^${searchCategory}s$`;

		const products = await Product.find({
			category: { $regex: new RegExp(regexPattern, "i") },
		});

		if (!products || products.length === 0) {
			return { error: "No products found in this category", status: 404 };
		}

		return products.map((product) => ({
			...product.toObject(),
			_id: product._id.toString(),
		}));
	} catch (error) {
		console.error("Error fetching products by category:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch products by category" }),
			{ status: 500 },
		);
	}
}
