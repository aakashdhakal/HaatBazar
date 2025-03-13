"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/app/(server)/actions/order";

export default function OrdersPage() {
	const { status } = useSession();
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all");
	const [sortOption, setSortOption] = useState("newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedOrder, setSelectedOrder] = useState(null);

	// Simulated orders data (replace with actual API call)
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const ordersData = await getOrders();
				setOrders(ordersData);
			} catch (error) {
				console.error("Error fetching orders:", error);
			} finally {
				setLoading(false);
			}
		};

		if (status === "unauthenticated") {
			router.push("/login");
		} else if (status === "authenticated") {
			fetchOrders();
		}
	}, [status, router]);

	// Filter and sort orders
	const filteredOrders = orders
		.filter((order) => {
			// Filter by status
			if (filterStatus !== "all" && order.status !== filterStatus) return false;

			// Search by order ID or items
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesOrderId = order.id.toLowerCase().includes(query);
				const matchesItems = order.items.some((item) =>
					item.name.toLowerCase().includes(query),
				);
				return matchesOrderId || matchesItems;
			}

			return true;
		})
		.sort((a, b) => {
			// Sort orders
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);

			if (sortOption === "newest") {
				return dateB - dateA;
			} else if (sortOption === "oldest") {
				return dateA - dateB;
			} else if (sortOption === "highest") {
				return b.total - a.total;
			} else if (sortOption === "lowest") {
				return a.total - b.total;
			}
			return 0;
		});

	// Format date function
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
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

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mb-8">
				<h1 className="text-3xl font-heading font-bold text-gray-900">
					My Orders
				</h1>
				<p className="text-gray-600 mt-2">View and manage all your orders</p>
			</div>

			{/* Filters and Search */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
				<div className="flex flex-col md:flex-row justify-between gap-4">
					<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
						<div className="flex-shrink-0">
							<label
								htmlFor="filter"
								className="block text-sm font-medium text-gray-700 mb-1">
								Filter by Status
							</label>
							<select
								id="filter"
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="w-full sm:w-auto block py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
								<option value="all">All Orders</option>
								<option value="processing">Processing</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>
						<div className="flex-shrink-0">
							<label
								htmlFor="sort"
								className="block text-sm font-medium text-gray-700 mb-1">
								Sort by
							</label>
							<select
								id="sort"
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value)}
								className="w-full sm:w-auto block py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
								<option value="newest">Newest First</option>
								<option value="oldest">Oldest First</option>
								<option value="highest">Highest Amount</option>
								<option value="lowest">Lowest Amount</option>
							</select>
						</div>
					</div>
					<div className="relative flex-grow max-w-md">
						<label
							htmlFor="search"
							className="block text-sm font-medium text-gray-700 mb-1">
							Search Orders
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Icon icon="mdi:magnify" className="h-5 w-5 text-gray-400" />
							</div>
							<Input
								type="text"
								id="search"
								placeholder="Search by order ID or item name"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-2 border-gray-200 bg-gray-50 focus:bg-white rounded-lg w-full"
							/>
							{searchQuery && (
								<button
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setSearchQuery("")}>
									<Icon
										icon="mdi:close-circle"
										className="h-5 w-5 text-gray-400 hover:text-gray-600"
									/>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Orders List */}
			{loading ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
					<p className="text-gray-600">Loading your orders...</p>
				</div>
			) : filteredOrders.length > 0 ? (
				<div className="space-y-6">
					{filteredOrders.map((order) => (
						<div
							key={order.id}
							className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
								selectedOrder === order.id ? "ring-2 ring-primary" : ""
							}`}>
							{/* Order Header */}
							<div className="border-b border-gray-100 bg-gray-50/80 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<div className="flex items-center gap-3">
										<h3 className="font-medium text-gray-900">{order.id}</h3>
										<span
											className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
												order.status,
											)}`}>
											{order.status.charAt(0).toUpperCase() +
												order.status.slice(1)}
										</span>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										Placed on {formatDate(order.date)}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<p className="font-medium">${order.total.toFixed(2)}</p>
									<Button
										onClick={() =>
											setSelectedOrder(
												selectedOrder === order.id ? null : order.id,
											)
										}
										variant="ghost"
										className="text-gray-600 hover:text-gray-900 p-2">
										<Icon
											icon={
												selectedOrder === order.id
													? "mdi:chevron-up"
													: "mdi:chevron-down"
											}
											className="h-5 w-5"
										/>
									</Button>
								</div>
							</div>

							{/* Order Summary (always visible) */}
							<div className="p-4 sm:p-6">
								<div className="flex items-start gap-4">
									<div className="hidden sm:flex items-center justify-center bg-gray-100 rounded-lg p-3">
										<Icon
											icon={getStatusIcon(order.status)}
											className="h-6 w-6 text-gray-600"
										/>
									</div>
									<div className="flex-grow">
										<div className="flex flex-wrap gap-4 mb-4">
											{order.items.slice(0, 3).map((item) => (
												<div key={item.id} className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
														<Image
															src={item.image}
															alt={item.name}
															fill
															className="object-cover"
														/>
													</div>
													<div>
														<p className="text-sm font-medium text-gray-900 line-clamp-1">
															{item.name}
														</p>
														<p className="text-xs text-gray-600">
															Qty: {item.quantity}
														</p>
													</div>
												</div>
											))}
											{order.items.length > 3 && (
												<div className="flex items-center">
													<span className="text-sm text-gray-600">
														+{order.items.length - 3} more items
													</span>
												</div>
											)}
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 mt-4 sm:items-center justify-between">
									{order.status === "delivered" && (
										<Button variant="outline" className="sm:w-auto">
											<Icon icon="mdi:reload" className="h-4 w-4 mr-2" />
											Buy Again
										</Button>
									)}

									{(order.status === "processing" ||
										order.status === "shipped") && (
										<Button
											variant="outline"
											className="text-gray-600 sm:w-auto border-gray-200">
											<Icon icon="mdi:map-marker" className="h-4 w-4 mr-2" />
											Track Order
										</Button>
									)}

									<div className="flex gap-2 ml-auto">
										<Button variant="outline" className="border-gray-200">
											<Icon
												icon="mdi:help-circle-outline"
												className="h-4 w-4 mr-2"
											/>
											Support
										</Button>
										<Link href={`/orders/${order.id}/details`}>
											<Button>
												<span>View Details</span>
												<Icon icon="mdi:arrow-right" className="h-4 w-4 ml-2" />
											</Button>
										</Link>
									</div>
								</div>
							</div>

							{/* Order Details (expandable) */}
							{selectedOrder === order.id && (
								<div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50">
									{/* Order Timeline */}
									<div className="mb-6">
										<h4 className="font-medium text-gray-900 mb-4">
											Order Timeline
										</h4>
										<div className="relative">
											{/* Progress line */}
											<div className="absolute top-0 left-4 h-full w-px bg-gray-200"></div>

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
															<h5 className="font-medium text-gray-900">
																{event.text}
															</h5>
															<p className="text-sm text-gray-600">
																{new Date(event.date).toLocaleString()}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Order Details Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Shipping Information */}
										<div>
											<h4 className="font-medium text-gray-900 mb-3">
												Shipping Information
											</h4>
											<div className="bg-white rounded-lg border border-gray-200 p-4">
												<div className="flex gap-3 mb-4">
													<div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
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
															{order.shipping.address}
														</p>
													</div>
												</div>
												<div className="flex gap-3">
													<div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
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
															${order.shipping.cost.toFixed(2)}
														</p>
													</div>
												</div>
											</div>
										</div>

										{/* Payment Information */}
										<div>
											<h4 className="font-medium text-gray-900 mb-3">
												Payment Information
											</h4>
											<div className="bg-white rounded-lg border border-gray-200 p-4">
												<div className="flex gap-3 mb-4">
													<div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
														<Icon
															icon="mdi:credit-card-outline"
															className="h-5 w-5 text-gray-600"
														/>
													</div>
													<div>
														<p className="text-sm font-medium text-gray-900">
															Payment Method
														</p>
														<p className="text-sm text-gray-600">
															{order.payment.method}
														</p>
													</div>
												</div>
												<div className="border-t border-gray-100 pt-3 mt-3">
													<div className="flex justify-between text-sm">
														<span className="text-gray-600">Subtotal</span>
														<span className="text-gray-900">
															${order.payment.subtotal.toFixed(2)}
														</span>
													</div>
													<div className="flex justify-between text-sm mt-2">
														<span className="text-gray-600">Shipping</span>
														<span className="text-gray-900">
															${order.shipping.cost.toFixed(2)}
														</span>
													</div>
													<div className="flex justify-between text-sm mt-2">
														<span className="text-gray-600">Tax</span>
														<span className="text-gray-900">
															${order.payment.tax.toFixed(2)}
														</span>
													</div>
													<div className="flex justify-between font-medium mt-3 pt-3 border-t border-gray-100">
														<span>Total</span>
														<span>${order.payment.total.toFixed(2)}</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* All Order Items */}
									<div className="mt-6">
										<h4 className="font-medium text-gray-900 mb-3">
											Order Items
										</h4>
										<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50">
													<tr>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Item
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
															Price
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
															Quantity
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
															Total
														</th>
													</tr>
												</thead>
												<tbody className="bg-white divide-y divide-gray-200">
													{order.items.map((item) => (
														<tr key={item.id}>
															<td className="px-6 py-4 whitespace-nowrap">
																<div className="flex items-center">
																	<div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
																		<Image
																			src={item.image}
																			alt={item.name}
																			fill
																			className="object-cover"
																		/>
																	</div>
																	<div className="ml-4">
																		<div className="text-sm font-medium text-gray-900">
																			{item.name}
																		</div>
																	</div>
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
																${item.price.toFixed(2)}
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
																{item.quantity}
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
																${(item.price * item.quantity).toFixed(2)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
					<div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<Icon
							icon="mdi:shopping-outline"
							className="h-8 w-8 text-gray-500"
						/>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No orders found
					</h3>
					{searchQuery || filterStatus !== "all" ? (
						<p className="text-gray-600 max-w-md mx-auto">
							We couldn&apos;t find any orders matching your search. Try
							adjusting your filters or search criteria.
						</p>
					) : (
						<p className="text-gray-600 max-w-md mx-auto">
							You haven&apos;t placed any orders yet. Browse our products and
							start shopping!
						</p>
					)}
					<div className="mt-6">
						<Link href="/products">
							<Button>
								<Icon icon="mdi:shopping" className="mr-2 h-4 w-4" />
								Start Shopping
							</Button>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
