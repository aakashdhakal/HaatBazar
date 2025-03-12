import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		transactionId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ["esewa", "khalti", "cash"],
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	},
);

const Transaction =
	mongoose.models?.Transaction ||
	mongoose.model("Transaction", transactionSchema);

export default Transaction;
