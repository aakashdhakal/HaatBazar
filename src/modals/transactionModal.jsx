import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		transactionId: {
			type: String,
			required: true,
		},
		orderId: {
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
			enum: ["pending", "completed", "failed", "refunded"],
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
