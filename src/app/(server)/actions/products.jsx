"use server";
import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

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
	console.log("Creating product with data:", data);
	try {
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

export async function updateStock(stock) {
	await dbConnect();
	try {
		// Handle both single product and array of products
		if (Array.isArray(stock)) {
			// Handle multiple products
			const updatePromises = stock.map((item) =>
				Product.findByIdAndUpdate(item._id, {
					countInStock: item.countInStock,
				}),
			);

			const results = await Promise.all(updatePromises);
			const notFoundCount = results.filter((r) => !r).length;

			return {
				message: `Updated stock for ${
					results.length - notFoundCount
				} products successfully`,
				notFound: notFoundCount > 0 ? notFoundCount : undefined,
			};
		} else {
			// Handle single product
			const product = await Product.findByIdAndUpdate(stock._id, {
				countInStock: stock.countInStock,
			});

			if (!product) {
				return { error: "Product not found", status: 404 };
			}

			return {
				message: "Product stock updated successfully",
			};
		}
	} catch (error) {
		console.error("Error updating product stock:", error);
		return new Response(
			JSON.stringify({ error: "Failed to update product stock" }),
			{
				status: 500,
			},
		);
	}
}

async function deleteProductImage(imagePath) {
	// Construct the full path to the image file
	const fullPath = path.join(process.cwd(), "public", imagePath);

	try {
		// Check if the file exists before attempting to delete it
		if (fs.existsSync(fullPath)) {
			await fs.promises.unlink(fullPath);
			console.log(`Deleted image at ${fullPath}`);
		} else {
			console.warn(`Image not found at ${fullPath}`);
		}
	} catch (error) {
		console.error("Error deleting product image:", error);
	}
}

async function uploadProductImage(file, productName) {
	// Validate the file object
	if (!file || !file.name || !file.data) {
		throw new Error("Invalid file object");
	}

	// Decode the base64 data into a buffer
	const fileBuffer = Buffer.from(file.data, "base64");

	// Create base uploads directory if it doesn't exist
	const uploadDir = path.join(process.cwd(), "public", "uploads");
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	// Create product-specific directory
	const productDir = path.join(uploadDir, productName);
	if (!fs.existsSync(productDir)) {
		fs.mkdirSync(productDir, { recursive: true });
	}

	// Save file in the product directory
	const filePath = path.join(productDir, file.name);
	await fs.promises.writeFile(filePath, fileBuffer);

	// Return the public path to the image
	return `/uploads/${productName}/${file.name}`;
}
