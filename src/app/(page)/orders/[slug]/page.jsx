"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/app/(server)/actions/order";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function OrderDetailPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	const params = useParams();
	const orderId = params.slug;
	const [order, setOrder] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrderData = async () => {
			try {
				setLoading(true);
				const orderData = await getOrderById(orderId);
				if (orderData) {
					setOrder(orderData);
					console.log("Order data:", orderData);
				} else {
					setError("Order not found or you don't have permission to view it");
				}
			} catch (error) {
				setError(error.message || "Error fetching order");
			} finally {
				setLoading(false);
			}
		};

		fetchOrderData();
	}, [orderId]);

	// Helper function to get payment method display name
	const getPaymentMethodName = (method) => {
		switch (method) {
			case "esewa":
				return "eSewa";
			case "khalti":
				return "Khalti";
			case "cash":
				return "Cash on Delivery";
			default:
				return method.charAt(0).toUpperCase() + method.slice(1);
		}
	};

	// Helper function to get payment status badge style
	const getPaymentStatusBadge = (status) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "refunded":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-10 max-w-5xl">
				<div className="flex items-center mb-6">
					<div className="w-8 h-5 bg-gray-200 animate-pulse rounded"></div>
					<div className="w-20 h-5 bg-gray-200 animate-pulse rounded ml-2"></div>
					<div className="w-16 h-5 bg-gray-200 animate-pulse rounded ml-auto"></div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
					<div className="w-48 h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
					<div className="w-full h-24 bg-gray-200 animate-pulse rounded mb-6"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
							<div className="w-full h-40 bg-gray-200 animate-pulse rounded"></div>
						</div>
						<div>
							<div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
							<div className="w-full h-40 bg-gray-200 animate-pulse rounded"></div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="w-32 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
					<div className="w-full h-60 bg-gray-200 animate-pulse rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-16 max-w-5xl">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
					<div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
						<Icon icon="mdi:alert" className="h-10 w-10 text-red-500" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Order Not Found
					</h2>
					<p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
					<Link href="/orders">
						<Button>
							<Icon icon="mdi:arrow-left" className="mr-2 h-4 w-4" />
							Back to My Orders
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (!order) return null;

	// Calculate total items
	const totalItems = order.products?.length || 0;

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			{/* Back button and order info */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div className="flex items-center">
					<Link
						href="/orders"
						className="flex items-center text-gray-600 hover:text-gray-900">
						<Icon icon="mdi:arrow-left" className="mr-2 h-4 w-4" />
						<span>Back to Orders</span>
					</Link>
				</div>
				<div className="flex items-center">
					<span className="text-gray-600 mr-2">Order ID:</span>
					<span className="font-medium">{order._id}</span>
				</div>
			</div>

			{/* Order Status Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							Order Details
						</h1>
						<p className="text-gray-600">
							Placed on {formatDate(order.createdAt)}
						</p>
					</div>
					<StatusBadge status={order.status} />
				</div>

				{/* Order Info Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Shipping Information */}
					<div>
						<h3 className="font-medium text-gray-900 mb-4">
							Shipping Information
						</h3>
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
							<div className="flex items-start gap-3">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon="mdi:map-marker-outline"
										className="h-5 w-5 text-gray-600"
									/>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">
										Delivery Address
									</p>
									<p className="text-sm text-gray-600 whitespace-pre-wrap">
										{order.shippingAddress}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Information - NEW SECTION */}
					<div>
						<h3 className="font-medium text-gray-900 mb-4">
							Payment Information
						</h3>
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
							<div className="flex items-start gap-3 mb-4">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon="mdi:credit-card-outline"
										className="h-5 w-5 text-gray-600"
									/>
								</div>
								<div className="flex items-center gap-4">
									<p className="text-sm font-medium text-gray-900">
										Payment Method
									</p>
									<p className="text-sm text-gray-600">
										{getPaymentMethodName(order.paymentInfo?.paymentMethod)}
									</p>
								</div>
							</div>

							{order.paymentInfo?.transactionUuid && (
								<div className="flex items-start gap-3 mb-4">
									<div className="bg-white rounded-lg p-2 shadow-sm">
										<Icon
											icon="mdi:identifier"
											className="h-5 w-5 text-gray-600"
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900">
											Transaction ID
										</p>
										<p className="text-sm text-gray-600">
											{order.paymentInfo.transactionUuid}
										</p>
									</div>
								</div>
							)}

							<div className="flex items-start gap-3">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon="mdi:check-circle-outline"
										className="h-5 w-5 text-gray-600"
									/>
								</div>
								<div className="flex items-center gap-4">
									<p className="text-sm font-medium text-gray-900">
										Payment Status
									</p>
									<StatusBadge status={order.paymentInfo?.status} />
								</div>
							</div>
						</div>
					</div>

					{/* Billing Information */}
					<div className="md:col-span-2">
						<h3 className="font-medium text-gray-900 mb-4">
							Billing Information
						</h3>
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div className="flex items-start gap-3">
									<div className="bg-white rounded-lg p-2 shadow-sm">
										<Icon
											icon="mdi:receipt-outline"
											className="h-5 w-5 text-gray-600"
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900">
											Billing Address
										</p>
										<p className="text-sm text-gray-600 whitespace-pre-wrap">
											{order.billingAddress}
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">
											Subtotal ({totalItems} items)
										</span>
										<span className="text-gray-900">
											Rs {order.totalAmount.toFixed(2)}
										</span>
									</div>

									{/* You could add shipping cost here if available */}
									{/* <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900">
                                            Rs {(order.shippingFee || 0).toFixed(2)}
                                        </span>
                                    </div> */}

									<div className="pt-3 border-t border-gray-200">
										<div className="flex justify-between font-medium">
											<span>Total</span>
											<span className="text-lg">
												Rs {order.totalAmount.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Order Items */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h3 className="font-medium text-gray-900 mb-6">Order Items</h3>

				<div className="divide-y divide-gray-100">
					{order.products?.map((item, index) => (
						<div key={item._id} className={`py-5 ${index === 0 ? "pt-0" : ""}`}>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
									<SafeImage
										src={item.product?.image}
										alt={item.product?.name || "Product"}
										type="product"
										fill
										className="object-cover"
									/>
								</div>

								<div className="flex-grow">
									<div className="flex flex-col sm:flex-row justify-between">
										<div>
											<h4 className="font-medium text-gray-900">
												{item.product?.name}
											</h4>
											<p className="text-sm text-gray-600">
												Quantity: {item.quantity}
											</p>
										</div>
										<div className="mt-2 sm:mt-0 text-right">
											<p className="text-gray-900 font-medium">
												Rs {(item.price * item.quantity).toFixed(2)}
											</p>
											<p className="text-sm text-gray-500">
												Rs {item.price.toFixed(2)} each
											</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-2 mt-3">
										<Link href={`/products/${item.product?._id}`}>
											<Button variant="outline" size="sm">
												View Product
											</Button>
										</Link>

										{(order.status === "completed" ||
											order.status === "delivered") && (
											<>
												<Button variant="outline" size="sm">
													<Icon
														icon="mdi:star-outline"
														className="mr-1.5 h-4 w-4"
													/>
													Review
												</Button>
												<Button variant="outline" size="sm">
													<Icon icon="mdi:reload" className="mr-1.5 h-4 w-4" />
													Buy Again
												</Button>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Call to actions */}
				<div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
					{order.status === "processing" && (
						<Button variant="outline">
							<Icon icon="mdi:close" className="mr-2 h-4 w-4" />
							Cancel Order
						</Button>
					)}

					{(order.status === "completed" || order.status === "delivered") && (
						<Button>
							<Icon icon="mdi:reload" className="mr-2 h-4 w-4" />
							Reorder All Items
						</Button>
					)}

					{/* Show different actions based on payment status */}
					{order.paymentInfo?.status === "pending" &&
						order.paymentInfo?.method !== "cash" && (
							<Button variant="default">
								<Icon icon="mdi:cash" className="mr-2 h-4 w-4" />
								Complete Payment
							</Button>
						)}

					<Button variant="outline">
						<Icon icon="mdi:chat-processing-outline" className="mr-2 h-4 w-4" />
						Need Help?
					</Button>
				</div>
			</div>
		</div>
	);
}
