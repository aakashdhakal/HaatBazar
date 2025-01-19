"use server";
import { dbConnect } from "@/app/lib/db";
import User from "@/app/modals/userModal";
import bcrypt from "bcryptjs";

export async function POST(req) {
	await dbConnect();

	try {
		const { name, email, password } = await req.json();
		const hashedPassword = await bcrypt.hash(password, 10);

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			if (existingUser.password === null) {
				await User.findOneAndUpdate({ email }, { password: hashedPassword });
				return new Response(
					JSON.stringify({ message: "Password Updated Successfully" }),
					{
						status: 200,
					},
				);
			} else {
				return new Response(
					JSON.stringify({ message: "Email is already in use" }),
					{ status: 400 },
				);
			}
		}

		// Create a new user
		const user = await User.create({ name, email, password: hashedPassword });

		if (!user) {
			return new Response(JSON.stringify({ message: "Signup failed" }), {
				status: 400,
			});
		}

		return new Response(JSON.stringify({ message: "Signup successful" }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error registering user:", error);
		return new Response(JSON.stringify({ error: "Failed to register user" }), {
			status: 500,
		});
	}
}
