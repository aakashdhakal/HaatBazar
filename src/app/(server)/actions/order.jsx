"use server";
import Order from "@/modals/orderModal";
import dbConnect from "@/lib/db";
import { auth } from "@/app/auth";
import mongoose from "mongoose";
import { decreaseOrderStock } from "./products";

// Helper function to convert an order to a plain object
function convertOrderToPlainObject(order) {
	return {
		...order,
		user: order.user.toString(), // Convert ObjectId to string
		products: order.products.map((product) => ({
			...product,
			product: {
				...product.product,
				_id: product.product._id.toString(), // Convert ObjectId to string
			},
			_id: product._id.toString(), // Convert ObjectId to string
		})),
		paymentInfo: {
			...order.paymentInfo,
			_id: order.paymentInfo._id.toString(), // Convert ObjectId to string
		},
		_id: order._id.toString(), // Convert ObjectId to string
		createdAt: order.createdAt.toISOString(), // Convert Date to string
		updatedAt: order.updatedAt.toISOString(), // Convert Date to string
	};
}

// Function to create a new order
export async function createOrder(orderData) {
	try {
		// Connect to the database
		await dbConnect();

		// Authenticate the user and get the session
		const session = await auth();

		if (!session?.user?.id) {
			console.error("User not authenticated");
			return false;
		}

		// Create a new order instance
		const newOrder = new Order({
			user: session.user.id,
			products: orderData.products,
			billingAddress: orderData.billingAddress,
			shippingAddress: orderData.shippingAddress,
			totalAmount: orderData.totalAmount,
			paymentInfo: orderData.paymentInfo,
			status: "processing",
		});

		// Save the new order to the database
		const savedOrder = await newOrder.save();
		await decreaseOrderStock(orderData.products);

		return { success: true };
	} catch (error) {
		console.error("Error creating order:", error.message);
		return { success: false, error: error.message };
	}
}

// Function to get orders for the authenticated user
export async function getOrders() {
	try {
		await dbConnect();
		const session = await auth();

		if (!session?.user?.id) {
			console.error("User not authenticated");
			return []; // Or throw an error, depending on your needs
		}

		const orders = await Order.find({ user: session.user.id })
			.populate({
				path: "products.product",
				select: "name price image brand category description",
			})
			.populate({
				path: "paymentInfo",
				select: "transactionId amount paymentMethod status",
			})
			.lean(); // Use lean() to return plain JavaScript objects

		// Convert any non-plain objects to plain objects
		const plainOrders = orders.map(convertOrderToPlainObject);

		return plainOrders;
	} catch (error) {
		console.error("Error fetching orders:", error);
		return []; // Or throw an error, depending on your needs
	}
}

// Function to get all orders (admin use case)
export async function getAllOrders() {
	try {
		await dbConnect();

		const orders = await Order.find({})
			.populate({
				path: "products.product",
				select: "name price image brand category description",
			})
			.populate({
				path: "paymentInfo",
				select: "transactionId amount paymentMethod status",
			})
			.lean(); // Use lean() to return plain JavaScript objects

		// Convert any non-plain objects to plain objects
		const plainOrders = orders.map(convertOrderToPlainObject);

		return plainOrders;
	} catch (error) {
		console.error("Error fetching all orders:", error);
		return []; // Or throw an error, depending on your needs
	}
}

// Function to get a specific order by ID for the authenticated user
export async function getOrderById(id) {
	try {
		await dbConnect();
		const session = await auth();

		if (!session?.user?.id) {
			console.error("User not authenticated");
			return null; // Or throw an error, depending on your needs
		}

		const order = await Order.findOne({ user: session.user.id, _id: id })
			.populate({
				path: "products.product",
				select: "name price image brand category description",
			})
			.populate({
				path: "paymentInfo",
				select: "transactionId amount paymentMethod status",
			})
			.lean(); // Use lean() to return plain JavaScript objects

		if (!order) {
			console.error("Order not found");
			return null;
		}

		// Convert any non-plain objects to plain objects
		const plainOrder = convertOrderToPlainObject(order);

		// If the order is not from the authorized user, return null
		if (plainOrder.user !== session.user.id) {
			return null;
		}
		return plainOrder;
	} catch (error) {
		console.error("Error fetching order:", error);
		return null; // Or throw an error, depending on your needs
	}
}

export async function getOrderByTransactionId(transactionId) {
	try {
		await dbConnect();

		const order = await Order.findOne({
			"paymentInfo.transactionId": transactionId,
		})
			.populate({
				path: "products.product",
				select: "name price image brand category description",
			})
			.populate({
				path: "paymentInfo",
				select: "transactionId amount paymentMethod status",
			})
			.lean(); // Use lean() to return plain JavaScript objects

		if (!order) {
			console.error("Order not found for transactionId:", transactionId);
			return null;
		}

		return convertOrderToPlainObject(order);
	} catch (error) {
		console.error("Error fetching order by transactionId:", error);
		return null;
	}
}

// Function to update the status of an order
export async function updateOrderStatus(id, status) {
	try {
		await dbConnect();

		const update = await Order.findByIdAndUpdate(id, { status }, { new: true });
		if (!update) {
			console.error("Order not found");
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error updating order status:", error);
		return false;
	}
}
