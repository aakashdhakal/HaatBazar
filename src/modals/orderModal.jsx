import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		paymentInfo: {
			transactionUuid: {
				type: String,
				required: true,
			},
			method: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				enum: ["pending", "paid", "refunded"],
				default: "pending",
			},
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
		},
		shippingAddress: {
			type: String,
			required: true,
		},
		billingAddress: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["processing", "delivered", "cancelled", "returned", "shipped"],
			default: "processing",
		},
	},
	{
		timestamps: true,
	},
);

const Order = mongoose.models?.Order || mongoose.model("Order", orderSchema);

export default Order;
