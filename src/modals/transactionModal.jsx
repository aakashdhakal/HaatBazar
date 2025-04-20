import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		transactionId: {
			type: String,
			required: true,
		},
		amount: {
			product: {
				type: Number,
				required: true,
				description: "Total price of products before fees/discounts",
			},
			shipping: {
				type: Number,
				default: 0,
				description: "Shipping fee",
			},
			discount: {
				type: Number,
				default: 0,
				description: "Discount applied (positive number)",
			},
			other: {
				type: Number,
				default: 0,
				description: "Other fees (e.g. tax, processing)",
			},
			total: {
				type: Number,
				required: true,
				description: "Final total amount charged",
			},
		},
		paymentMethod: {
			type: String,
			enum: ["esewa", "khalti", "cash"],
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "paid", "failed", "refunded"],
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
