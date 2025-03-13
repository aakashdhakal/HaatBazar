"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params.slug;
	const { data: session, status } = useSession();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Protect route
		if (status === "unauthenticated") {
			router.push("/login");
			return;
		}

		// Fetch order data
		const fetchOrderData = async () => {
			setLoading(true);
			try {
				// In production, replace this with actual API call:
				// const response = await fetch(`/api/orders/${orderId}`);
				// if (!response.ok) throw new Error("Order not found");
				// const data = await response.json();

				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Simulated order data
				const orderData = {
					id: orderId,
					date: "2023-12-15T10:30:00",
					status: "delivered",
					total: 124.99,
					items: [
						{
							id: "prod-1",
							name: "Organic Apples (1kg)",
							price: 4.99,
							quantity: 2,
							image: "/products/apples.jpg",
						},
						{
							id: "prod-2",
							name: "Free-Range Eggs (12 pack)",
							price: 5.99,
							quantity: 1,
							image: "/products/eggs.jpg",
						},
						{
							id: "prod-3",
							name: "Whole Grain Bread",
							price: 3.99,
							quantity: 2,
							image: "/products/bread.jpg",
						},
						{
							id: "prod-4",
							name: "Organic Milk (1L)",
							price: 2.99,
							quantity: 3,
							image: "/products/milk.jpg",
						},
					],
					shipping: {
						address: {
							line1: "123 Main Street",
							line2: "Apt 4B",
							city: "New York",
							state: "NY",
							postalCode: "10001",
							country: "United States",
						},
						recipient: {
							name: "John Doe",
							phone: "+1 (555) 123-4567",
							email: "john@example.com",
						},
						method: "Express Delivery",
						cost: 7.99,
						trackingNumber: "TRK3847593847593",
						trackingUrl: "https://tracking.example.com/TRK3847593847593",
						estimatedDelivery: "2023-12-17",
						actualDelivery: "2023-12-17T14:20:00",
					},
					payment: {
						method: "Credit Card",
						cardLast4: "4582",
						cardBrand: "Visa",
						subtotal: 34.92,
						tax: 2.89,
						discounts: [
							{
								code: "WELCOME10",
								description: "New customer discount",
								amount: 3.49,
							},
						],
						total: 42.31,
					},
					timeline: [
						{
							status: "ordered",
							date: "2023-12-15T10:30:00",
							text: "Order placed",
						},
						{
							status: "processing",
							date: "2023-12-15T11:45:00",
							text: "Payment confirmed",
						},
						{
							status: "processing",
							date: "2023-12-15T14:20:00",
							text: "Order being prepared",
						},
						{
							status: "shipped",
							date: "2023-12-16T09:15:00",
							text: "Order shipped",
						},
						{
							status: "delivered",
							date: "2023-12-17T14:20:00",
							text: "Order delivered",
						},
					],
					invoiceUrl: "/invoices/INV-5839-2023.pdf",
				};

				setOrder(orderData);
			} catch (err) {
				console.error("Error fetching order:", err);
				setError(
					"We couldn't find this order. It may have been removed or the link is incorrect.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderData();
	}, [orderId, router, status]);

	// Format date
	const formatDate = (dateString, includeTime = false) => {
		try {
			const date = new Date(dateString);
			const options = {
				year: "numeric",
				month: "long",
				day: "numeric",
				...(includeTime && { hour: "2-digit", minute: "2-digit" }),
			};
			return date.toLocaleDateString(undefined, options);
		} catch (e) {
			return dateString;
		}
	};

	// Get status color
	const getStatusColor = (status) => {
		switch (status) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "shipped":
				return "bg-blue-100 text-blue-800";
			case "processing":
				return "bg-yellow-100 text-yellow-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Get status icon
	const getStatusIcon = (status) => {
		switch (status) {
			case "delivered":
				return "mdi:package-variant-delivered";
			case "shipped":
				return "mdi:truck-delivery-outline";
			case "processing":
				return "mdi:clock-outline";
			case "cancelled":
				return "mdi:close-circle-outline";
			default:
				return "mdi:help-circle-outline";
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
					<span className="font-medium">{order.id}</span>
				</div>
			</div>

			{/* Order Status Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							Order Details
						</h1>
						<p className="text-gray-600">Placed on {formatDate(order.date)}</p>
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
								order.status,
							)}`}>
							<Icon
								icon={getStatusIcon(order.status)}
								className="mr-1.5 h-4 w-4"
							/>
							{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
						</span>
						<Link
							href={order.invoiceUrl}
							target="_blank"
							rel="noopener noreferrer">
							<Button variant="outline" size="sm" className="whitespace-nowrap">
								<Icon icon="mdi:download" className="mr-1.5 h-4 w-4" />
								Download Invoice
							</Button>
						</Link>
					</div>
				</div>

				{/* Order Timeline */}
				<div className="mb-8">
					<h3 className="font-medium text-gray-900 mb-4">Order Progress</h3>
					<div className="relative">
						{/* Progress line */}
						<div className="absolute top-0 left-4 h-full w-px bg-gray-200"></div>

						<div className="flex mb-4">
							{order.timeline.map((step, index) => {
								const isActive =
									index <=
									order.timeline.findIndex((t) => t.status === order.status);
								const isLast = index === order.timeline.length - 1;
								return (
									<div key={index} className="flex-1 relative">
										<div
											className={`h-2 ${
												isActive ? "bg-primary" : "bg-gray-200"
											} ${isLast ? "rounded-r-full" : ""} ${
												index === 0 ? "rounded-l-full" : ""
											}`}></div>
									</div>
								);
							})}
						</div>

						{/* Timeline events */}
						<div className="space-y-6">
							{order.timeline.map((event, index) => (
								<div key={index} className="flex gap-4">
									<div
										className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${getStatusColor(
											event.status,
										)}`}>
										<Icon
											icon={getStatusIcon(event.status)}
											className="h-4 w-4"
										/>
									</div>
									<div>
										<h5 className="font-medium text-gray-900">{event.text}</h5>
										<p className="text-sm text-gray-600">
											{formatDate(event.date, true)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Order Info Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Shipping Information */}
					<div>
						<h3 className="font-medium text-gray-900 mb-4">
							Shipping Information
						</h3>
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
							<div className="flex items-start gap-3 mb-5">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon="mdi:account-outline"
										className="h-5 w-5 text-gray-600"
									/>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">Recipient</p>
									<p className="text-sm text-gray-600">
										{order.shipping.recipient.name}
									</p>
									<p className="text-sm text-gray-600">
										{order.shipping.recipient.phone}
									</p>
									<p className="text-sm text-gray-600">
										{order.shipping.recipient.email}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 mb-5">
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
									<p className="text-sm text-gray-600">
										{order.shipping.address.line1}
									</p>
									{order.shipping.address.line2 && (
										<p className="text-sm text-gray-600">
											{order.shipping.address.line2}
										</p>
									)}
									<p className="text-sm text-gray-600">
										{order.shipping.address.city},{" "}
										{order.shipping.address.state}{" "}
										{order.shipping.address.postalCode}
									</p>
									<p className="text-sm text-gray-600">
										{order.shipping.address.country}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon="mdi:truck-outline"
										className="h-5 w-5 text-gray-600"
									/>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">
										Shipping Method
									</p>
									<p className="text-sm text-gray-600">
										{order.shipping.method}
									</p>
									<p className="text-sm text-gray-600">
										{order.status === "delivered" ? (
											<span>
												Delivered on {formatDate(order.shipping.actualDelivery)}
											</span>
										) : (
											<span>
												Estimated delivery by{" "}
												{formatDate(order.shipping.estimatedDelivery)}
											</span>
										)}
									</p>

									{order.shipping.trackingNumber && (
										<div className="mt-2">
											<p className="text-sm font-medium text-gray-900">
												Tracking Number
											</p>
											<div className="flex items-center gap-2 mt-1">
												<span className="text-sm text-gray-600">
													{order.shipping.trackingNumber}
												</span>
												<Link
													href={order.shipping.trackingUrl}
													target="_blank"
													rel="noopener noreferrer">
													<Button
														variant="link"
														size="sm"
														className="h-auto p-0">
														Track
													</Button>
												</Link>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Payment Information */}
					<div>
						<h3 className="font-medium text-gray-900 mb-4">
							Payment Information
						</h3>
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
							<div className="flex items-start gap-3 mb-5">
								<div className="bg-white rounded-lg p-2 shadow-sm">
									<Icon
										icon={
											order.payment.cardBrand === "Visa"
												? "logos:visa"
												: order.payment.cardBrand === "Mastercard"
												? "logos:mastercard"
												: "mdi:credit-card-outline"
										}
										className="h-5 w-5"
									/>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">
										Payment Method
									</p>
									<p className="text-sm text-gray-600">
										{order.payment.method}{" "}
										{order.payment.cardLast4
											? `ending in ${order.payment.cardLast4}`
											: ""}
									</p>
								</div>
							</div>

							<div className="mt-4 space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Subtotal</span>
									<span className="text-gray-900">
										${order.payment.subtotal.toFixed(2)}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Shipping</span>
									<span className="text-gray-900">
										${order.shipping.cost.toFixed(2)}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Tax</span>
									<span className="text-gray-900">
										${order.payment.tax.toFixed(2)}
									</span>
								</div>

								{order.payment.discounts &&
									order.payment.discounts.length > 0 && (
										<div>
											{order.payment.discounts.map((discount, index) => (
												<div
													key={index}
													className="flex justify-between text-sm">
													<span className="text-gray-600">
														{discount.description}
														{discount.code && (
															<span className="text-xs ml-1 text-gray-500">
																({discount.code})
															</span>
														)}
													</span>
													<span className="text-green-600">
														-${discount.amount.toFixed(2)}
													</span>
												</div>
											))}
										</div>
									)}

								<div className="pt-3 border-t border-gray-200">
									<div className="flex justify-between font-medium">
										<span>Total</span>
										<span className="text-lg">
											${order.payment.total.toFixed(2)}
										</span>
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
					{order.items.map((item, index) => (
						<div key={item.id} className={`py-5 ${index === 0 ? "pt-0" : ""}`}>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
									<Image
										src={item.image}
										alt={item.name}
										fill
										className="object-cover"
									/>
								</div>

								<div className="flex-grow">
									<div className="flex flex-col sm:flex-row justify-between">
										<div>
											<h4 className="font-medium text-gray-900">{item.name}</h4>
											<p className="text-sm text-gray-600">
												Quantity: {item.quantity}
											</p>
										</div>
										<div className="mt-2 sm:mt-0 text-right">
											<p className="text-gray-900 font-medium">
												${(item.price * item.quantity).toFixed(2)}
											</p>
											<p className="text-sm text-gray-500">
												${item.price.toFixed(2)} each
											</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-2 mt-3">
										<Link href={`/products/${item.id}`}>
											<Button variant="outline" size="sm">
												View Product
											</Button>
										</Link>

										{order.status === "delivered" && (
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

					{["shipped", "processing"].includes(order.status) && (
						<Link
							href={order.shipping.trackingUrl || "#"}
							target="_blank"
							rel="noopener noreferrer">
							<Button>
								<Icon icon="mdi:truck-fast-outline" className="mr-2 h-4 w-4" />
								Track Order
							</Button>
						</Link>
					)}

					{order.status === "delivered" && (
						<Button>
							<Icon icon="mdi:reload" className="mr-2 h-4 w-4" />
							Reorder All Items
						</Button>
					)}

					<Button variant="outline">
						<Icon icon="mdi:chat-processing-outline" className="mr-2 h-4 w-4" />
						Need Help?
					</Button>
				</div>
			</div>

			{/* Similar Products Recommendation */}
			<div className="mt-10">
				<h3 className="font-medium text-gray-900 mb-4">You Might Also Like</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{[1, 2, 3, 4, 5].map((item) => (
						<Link key={item} href="/products/recommended-product">
							<div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
								<div className="w-full h-40 bg-gray-100 relative">
									<Image
										src={`/products/recommendation-${item}.jpg`}
										alt={`Recommended Product ${item}`}
										fill
										className="object-cover"
									/>
								</div>
								<div className="p-3">
									<h5 className="font-medium text-sm text-gray-900 line-clamp-1">
										Recommended Product {item}
									</h5>
									<p className="text-sm text-primary mt-1">$9.99</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
