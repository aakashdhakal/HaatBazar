"use server";
import Order from "@/modals/orderModal";
import dbConnect from "@/lib/db";
import { auth } from "@/app/auth";

// Function to create a new order
export async function createOrder(order) {
	try {
		// Connect to the database
		await dbConnect();

		// Authenticate the user and get the session
		const session = await auth();

		if (!session?.user?.id) {
			console.error("User not authenticated");
			return false;
		}

		// Assign the user ID to the order
		order.user = session.user.id;

		// Log the complete order object
		console.log("Order data before saving:", JSON.stringify(order, null, 2));

		// Create a new order instance
		const newOrder = new Order(order);

		// Check for validation errors before saving
		const validationError = newOrder.validateSync();
		if (validationError) {
			console.error(
				"Validation errors:",
				JSON.stringify(validationError.errors, null, 2),
			);
			return false;
		}

		// Save the new order to the database
		const savedOrder = await newOrder.save();
		console.log("Order saved successfully with ID:", savedOrder._id);
		return true;
	} catch (error) {
		console.error("Error creating order:", error.message);

		// Check for specific types of errors
		if (error.name === "ValidationError") {
			console.error(
				"Validation error details:",
				JSON.stringify(error.errors, null, 2),
			);
		} else if (error.name === "MongoServerError" && error.code === 11000) {
			console.error("Duplicate key error:", error.keyValue);
		}

		return false;
	}
}

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
			.lean(); // Use lean() to return plain JavaScript objects

		// Convert any non-plain objects to plain objects
		const plainOrders = orders.map((order) => ({
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
			_id: order._id.toString(), // Convert ObjectId to string
			createdAt: order.createdAt.toISOString(), // Convert Date to string
			updatedAt: order.updatedAt.toISOString(), // Convert Date to string
		}));

		return plainOrders;
	} catch (error) {
		console.error("Error fetching orders:", error);
		return []; // Or throw an error, depending on your needs
	}
}

export async function getAllOrders() {
	await dbConnect();
	const orders = await Order.find({});
	return orders;
}

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
			.lean(); // Use lean() to return plain JavaScript objects

		if (!order) {
			console.error("Order not found");
			return null;
		}

		// Convert any non-plain objects to plain objects
		const plainOrder = {
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
			_id: order._id.toString(), // Convert ObjectId to string
			createdAt: order.createdAt.toISOString(), // Convert Date to string
			updatedAt: order.updatedAt.toISOString(), // Convert Date to string
		};

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

export async function updatePaymentStatus(id, status) {
	try {
		await dbConnect();

		const update = await Order.findByIdAndUpdate(
			id,
			{ $set: { "paymentInfo.status": status } },
			{ new: true },
		);
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
