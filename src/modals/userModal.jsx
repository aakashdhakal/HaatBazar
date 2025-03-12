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
		shippingAddress: {
			type: [String],
		},
		billingAddress: {
			type: [String],
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
