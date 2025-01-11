"use server";
import { dbConnect } from "@/app/lib/db";
import User from "@/app/models/User";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
	await dbConnect();

	const { username, password } = req.body;

	const user = await User.findOne({ username, password });
}
