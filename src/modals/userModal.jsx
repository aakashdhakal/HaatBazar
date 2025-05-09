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
			default: null,
			required: true,
		},
		role: {
			type: String,
			default: "user",
			required: true,
		},
		emailVerified: {
			type: Date,
			default: null,
		},
		image: {
			type: String,
			default: "profile.jpg",
			required: true,
		},
		dateOfBirth: {
			type: Date,
			default: null,
			required: false,
		},
		shippingAddress: [
			{
				province: {
					type: String,
					required: true,
				},
				district: {
					type: String,
					required: true,
				},
				city: {
					type: String,
					required: true,
				},
				street: {
					type: String,
					required: true,
				},
				ZIP: {
					type: String,
					required: true,
				},
			},
		],
		billingAddress: [
			{
				province: {
					type: String,
					required: true,
				},
				district: {
					type: String,
					required: true,
				},
				city: {
					type: String,
					required: true,
				},
				street: {
					type: String,
					required: true,
				},
				ZIP: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
