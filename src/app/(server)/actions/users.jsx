"use server";
import { auth } from "@/app/auth";
import User from "@/modals/userModal";
import dbConnect from "@/lib/db";

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

// Add this new function to your existing file
export async function updateUserProfile(formData) {
	try {
		await dbConnect();

		const session = await auth();
		if (!session || !session.user?.email) {
			return { success: false, error: "Not authenticated" };
		}

		// Parse formData
		const fullName = formData.get("fullName");
		const phoneNumber = formData.get("phoneNumber");
		const shippingAddress = formData.get("shippingAddress");
		const billingAddress = formData.get("billingAddress");

		// Check if user exists and update accordingly
		const user = await User.findOne({ email: session.user.email });
		if (!user) {
			return { success: false, error: "User not found" };
		}

		// Update user data
		user.name = fullName;
		if (phoneNumber) user.phoneNumber = phoneNumber;
		if (shippingAddress) user.shippingAddress = shippingAddress;
		if (billingAddress) user.billingAddress = billingAddress;

		await user.save();

		return { success: true };
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { success: false, error: error.message };
	}
}
