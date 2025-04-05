"use server";
import { auth } from "@/app/auth";
import User from "@/modals/userModal";
import dbConnect from "@/lib/db";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

export async function fetchShippingAddress() {
	await dbConnect();

	const session = await auth();
	if (!session || !session.user?.email) {
		throw new Error("Session or user email not found");
	}

	const user = await User.findOne({ email: session.user.email });
	if (!user) {
		throw new Error("User not found");
	}
	return JSON.stringify(user.shippingAddress);
}

export async function fetchBillingAddress() {
	await dbConnect();

	const session = await auth();
	if (!session || !session.user?.email) {
		throw new Error("Session or user email not found");
	}

	const user = await User.findOne({ email: session.user.email });
	if (!user) {
		throw new Error("User not found");
	}
	return JSON.stringify(user.billingAddress);
}

export async function updateUserProfile(formData) {
	try {
		await dbConnect();

		const session = await auth();
		if (!session || !session.user?.email) {
			return { success: false, error: "Not authenticated" };
		}

		// Parse formData
		const profilePicture = formData.get("profilePicture");

		if (profilePicture) {
			await uploadProfileImage({ image: profilePicture });
		}

		const fullName = formData.get("name");
		const phoneNumber = formData.get("phoneNumber");
		const gender = formData.get("gender");
		const dateOfBirth = new Date(formData.get("dateOfBirth"));
		const shippingAddress = JSON.parse(formData.get("shippingAddress"));
		const billingAddress = JSON.parse(formData.get("billingAddress"));


		// Check if user exists and update accordingly
		const user = await User.findOneAndUpdate(
			{ email: session.user.email },
			{
				name: fullName,
				phoneNumber: phoneNumber,
				gender: gender,
				dateOfBirth: dateOfBirth,
				shippingAddress: shippingAddress,
				billingAddress: billingAddress,
			},
			{ new: true },
		);

		if (!user) {
			return { success: false, error: "User not found" };
		}

		return { success: true };
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { success: false, error: error.message };
	}
}
export async function uploadProfileImage({ image }) {
	const session = await auth();
	const arrayBuffer = await image.arrayBuffer();
	const buffer = new Uint8Array(arrayBuffer);
	const imageName = `${session.user.name
		.replace(/\s+/g, "")
		.toLowerCase()}-${Date.now()}${path.extname(image.name)}`;
	const uploadDir = path.join(process.cwd(), "public", "uploads");
	const uploadPath = path.join(uploadDir, imageName);

	// Create the uploads directory if it doesn't exist
	await fs.mkdir(uploadDir, { recursive: true });

	await fs.writeFile(uploadPath, buffer);

	revalidatePath("/");

	return { success: true, filePath: `/uploads/${image.name}` };
}
