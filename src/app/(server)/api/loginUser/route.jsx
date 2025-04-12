import dbConnect from "@/lib/db";
import User from "@/modals/userModal";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	await dbConnect();

	const { username, password } = req.body;

	const user = await User.findOne({ username, password });
}
