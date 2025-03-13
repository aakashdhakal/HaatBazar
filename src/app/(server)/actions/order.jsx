"use server";
import Order from "@/modals/orderModal";
import { dbConnect } from "@/lib/db";
import { auth } from "@/app/auth";

// Function to create a new order
export async function createOrder(order) {
	// Connect to the database
	await dbConnect();
	// Authenticate the user and get the session
	const session = await auth();
	// Assign the user ID to the order
	order.user = session.user.id;
	// Create a new order instance
	console.log(order);
	const newOrder = new Order(order);
	// Save the new order to the database
	if (await newOrder.save()) {
		return true;
	} else {
		return false;
	}
	// Return the newly created order
}

export async function getOrders() {
	await dbConnect();
	const session = await auth();
	const orders = await Order.find({ user: session.user.id });

	// Return the array of objects
	console.log(orders);
	return orders;
}

export async function getAllOrders() {
	await dbConnect();
	const orders = await Order.find({});
	return orders;
}

export async function getOrderById(id) {
	await dbConnect();
	const order = await Order.findById(id);
	return order;
}
