"use server";
import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { generateFileName } from "@/lib/utils";

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
			const imagePath = await uploadProductImage(data.image, data.name);
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
				await deleteProductImage(imagePath.image);
			}
			const imagePath = await uploadProductImage(data.image, data.name);
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
		await deleteProductImage(product.image); // Delete the image from the server
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

async function deleteProductImage(imageUrl) {
	// Basic validation
	if (!imageUrl) {
		throw new Error("Invalid image URL");
	}

	try {
		// Make the POST request to the API
		const response = await fetch(
			"https://downloadmedia.aakashdhakal.com.np/api/delete-image",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ file_url: imageUrl }),
			},
		);

		// Parse the JSON response
		const responseData = await response.json();

		// Check if the response indicates success
		if (response.ok && responseData.success) {
			return true; // Indicate success
		} else {
			throw new Error(
				`Failed to delete image: ${responseData.error || "Unknown error"}`,
			);
		}
	} catch (error) {
		console.error("Error deleting product image:", error);
		throw new Error("Failed to delete product image");
	}
}

async function uploadProductImage(file, productName) {
	// Basic validation
	if (!file || !file.name || !file.size) {
		throw new Error("Invalid file object");
	}

	try {
		console.log("File data:", file); // Debugging line
		console.log("ProductName:", productName); // Debugging line

		// Prepare the payload for the API
		const formData = new FormData();
		const fileName = generateFileName(productName);
		formData.append("name", fileName);
		formData.append("image", file); // Append the file object directly

		console.log("FormData prepared:", formData); // Debugging line

		// Make the POST request to the API
		const response = await fetch(
			"https://downloadmedia.aakashdhakal.com.np/api/upload-image",
			{
				method: "POST",
				body: formData,
			},
		);

		// Parse the JSON response
		const responseData = await response.json();

		// Check if the response contains the image URL
		if (response.ok && responseData.image_url) {
			return responseData.image_url; // Return the image URL
		} else {
			throw new Error(
				`Failed to upload image: ${responseData.error || "Unknown error"}`,
			);
		}
	} catch (error) {
		console.error("Error uploading product image:", error);
		throw new Error("Failed to upload product image");
	}
}
