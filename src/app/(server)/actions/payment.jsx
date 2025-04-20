"use server";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Transaction from "@/modals/transactionModal";

export async function initiateKhaltiPayment(order) {
	const session = await auth();
	order = {
		...order,
		amount: (order.amount + order.shipping) * 100,
		product_details: Object.values(order.products).map((item) => ({
			identity: item._id,
			name: item.name,
			total_price: item.price * item.quantity * 100,
			quantity: item.quantity,
			unit_price: item.price * 100,
		})),
		return_url: "http://localhost:3000/orders",
		website_url: "http://localhost:3000",
		purchase_order_name: "Test Product",
		purchase_order_id: order.transactionUuid,
		customer_info: {
			name: session.user.name,
			email: session.user.email,
			shipping_address: order.shippingAddress,
			billing_address: order.billingAddress,
		},
		amount_breakdown: [
			{
				label: "Product Total",
				amount: order.amount * 100,
			},
			{
				label: "Shipping Fee",
				amount: order.shipping * 100,
			},
		],
		merchant_name: "HAATBAZAR",
	};

	// Remove unwanted keys
	delete order.products;
	delete order.shipping;
	delete order.transactionUuid;

	const response = await fetch(
		"https://dev.khalti.com/api/v2/epayment/initiate/",
		{
			method: "POST",
			headers: {
				Authorization: "Key 3ff9d57a2a5340c7a1401fe71f2f57f8",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		},
	);
	const data = await response.json();
	if (data) {
		redirect(data.payment_url);
	}
}

export async function createPayment(payment) {
	try {
		const createdPayment = await Transaction.create({
			transactionId: payment.transactionId,
			amount: payment.amount,
			paymentMethod: payment.paymentMethod,
		});

		// Return just what you need, _id as string
		return {
			_id: createdPayment._id.toString(),
		};
	} catch (error) {
		console.error("Error creating payment:", error);
		throw new Error("Payment creation failed");
	}
}

export async function updatePaymentStatus(transactionId, status) {
	try {
		const payment = await Transaction.findOneAndUpdate(
			{ transactionId },
			{ status },
			{ new: true },
		);
		if (!payment) {
			throw new Error("Payment not found");
		}
		return {
			...payment._doc,
			_id: payment._id.toString(),
		};
	} catch (error) {
		console.error("Error updating payment status:", error);
		throw new Error("Payment status update failed");
	}
}

export async function getPaymentByTransactionId(transactionId) {
	try {
		const payment = await Transaction.findOne({ transactionId });
		if (!payment) {
			console.error("Payment not found for transactionId:", transactionId);
			return null;
		}

		const plainPayment = {
			...payment._doc,
			_id: payment._id.toString(),
		};

		if (plainPayment.status === "failed") {
			return null;
		}
		return plainPayment;
	} catch (error) {
		console.error("Error fetching payment:", error);
		return null; // Or throw an error, depending on your needs
	}
}
