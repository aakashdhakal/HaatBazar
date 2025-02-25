"use server";
import { auth } from "../auth";
import User from "../modals/userModal";
import { dbConnect } from "../lib/db";

export async function fetchUserAddress() {
	await dbConnect();

	const session = await auth();
	if (!session || !session.user?.email) {
		throw new Error("Session or user email not found");
	}

	const user = await User.findOne({ email: session.user.email });
	if (!user) {
		throw new Error("User not found");
	}

	// Check if `shippingAddress` exists
	if (!user.shippingAddress) {
		throw new Error("Shipping address is missing");
	}

	return {
		shippingAddress: user.shippingAddress,
		billingAddress: user.billingAddress,
	};
}
