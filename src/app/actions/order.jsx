"use server";
import Order from "../modals/orderModal";
import { dbConnect } from "../lib/db";
import { auth } from "../auth";

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
