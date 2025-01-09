"use server";

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
