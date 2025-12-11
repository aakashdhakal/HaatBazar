"use server";
import { auth } from "@/app/auth";
import User from "@/modals/userModal";
import dbConnect from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateFileName } from "@/lib/utils";
import { uploadCloudinaryImage, deleteCloudinaryImage } from "@/lib/cloudinary";

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
		let profilePicture = formData.get("profilePicture");

		if (profilePicture) {
			const fileName = generateFileName(session.user.name);
			profilePicture = await uploadCloudinaryImage(profilePicture, fileName);
		}

		const fullName = formData.get("name");
		const phoneNumber = formData.get("phoneNumber");
		const gender = formData.get("gender");
		const dateOfBirth = new Date(formData.get("dateOfBirth"));
		const shippingAddress = JSON.parse(formData.get("shippingAddress"));
		const billingAddress = JSON.parse(formData.get("billingAddress"));
		const image = profilePicture || session.user.image;

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
				image: image,
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
export async function deleteUserProfile() {
	try {
		await dbConnect();

		const session = await auth();
		if (!session || !session.user?.email) {
			return { success: false, error: "Not authenticated" };
		}

		const user = await User.findOneAndDelete({ email: session.user.email });
		if (!user) {
			return { success: false, error: "User not found" };
		}

		await deleteCloudinaryImage(user.image);

		return { success: true };
	} catch (error) {
		console.error("Error deleting user profile:", error);
		return { success: false, error: error.message };
	}
}

export async function getCurrentUser() {
	try {
		await dbConnect();

		const session = await auth();
		if (!session || !session.user?.email) {
			return null;
		}

		const user = await User.findOne({ email: session.user.email })
			.select("name email image role")
			.lean();

		if (!user) {
			return null;
		}

		return {
			...user,
			_id: user._id.toString(),
		};
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
}

export async function getUserById(id) {
	try {
		await dbConnect();

		const user = await User.findById(id).select("name email image role").lean();

		if (!user) {
			return null;
		}

		return {
			...user,
			_id: user._id.toString(),
		};
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		return null;
	}
}

export async function getAllUsers() {
	try {
		await dbConnect();

		const users = await User.find({}).select("name email image role").lean();

		if (!users) {
			return [];
		}

		return users.map((user) => ({
			...user,
			_id: user._id.toString(),
		}));
	} catch (error) {
		console.error("Error fetching all users:", error);
		return [];
	}
}
