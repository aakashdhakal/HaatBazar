"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { getOrders } from "@/app/(server)/actions/order";
import OrderDetail from "@/components/OrderDetail";
import SelectComponent from "@/components/Select";
import { useSearchParams } from "next/navigation";
import { updatePaymentStatus } from "@/app/(server)/actions/payment";
import { clearCart } from "@/app/(server)/actions/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { normalizePaymentResponse } from "@/lib/utils";

export default function OrdersPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const parameters = useSearchParams();

	// State declarations
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all");
	const [sortOption, setSortOption] = useState("newest");
	const [searchQuery, setSearchQuery] = useState("");

	// Redirect unauthenticated users
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	// Handle payment updates
	useEffect(() => {
		const handlePaymentUpdate = async () => {
			if (!parameters) return;

			// Process payment response
			let paymentResponse;
			if (parameters.has("data")) {
				paymentResponse = normalizePaymentResponse(
					parameters.get("data"),
					true,
				);
			} else {
				paymentResponse = normalizePaymentResponse(parameters, false);
			}

			// Update payment status if successful
			if (paymentResponse?.status === "SUCCESS") {
				await clearCart();
				await updatePaymentStatus(paymentResponse.transactionUuid, "paid");
				fetchOrders(); // Refresh orders after payment update
			}
		};

		handlePaymentUpdate();
	}, [parameters]); // Only depend on URL parameters

	// Fetch orders
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

	// Initial orders fetch
	useEffect(() => {
		fetchOrders();
	}, []);

	// Filter and sort orders
	const filteredOrders = orders
		.filter((order) => {
			// Filter by status
			if (filterStatus !== "all" && order.status !== filterStatus) return false;

			// Filter by search query
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesOrderId = order._id
					.toString()
					.toLowerCase()
					.includes(query);
				const matchesItems = order.products.some((item) =>
					item.product?.name?.toLowerCase().includes(query),
				);
				return matchesOrderId || matchesItems;
			}
			return true;
		})
		.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);

			switch (sortOption) {
				case "oldest":
					return dateA - dateB;
				case "highest":
					return b.total - a.total;
				case "lowest":
					return a.total - b.total;
				case "newest":
				default:
					return dateB - dateA;
			}
		});

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{/* Page header */}
			<div className="mb-8">
				<h1 className="text-3xl font-heading font-bold text-gray-900">
					My Orders
				</h1>
				<p className="text-gray-600 mt-2">View and manage all your orders</p>
			</div>

			{/* Filters and Search section */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
				<div className="flex flex-col md:flex-row justify-between gap-4">
					{/* Status filter and Sort options */}
					<div className="flex flex-col sm:flex-row gap-6 sm:items-center">
						{/* Filter by Status dropdown */}
						<div className="flex-shrink-0 flex flex-col gap-1">
							<label
								htmlFor="filter"
								className="block text-sm font-medium text-gray-700 mb-1">
								Filter by Status
							</label>
							<SelectComponent
								defaultValue="all"
								className="w-96"
								options={[
									{ label: "All", value: "all" },
									{ label: "Pending", value: "pending" },
									{ label: "Paid", value: "paid" },
									{ label: "Cancelled", value: "cancelled" },
									{ label: "Returned", value: "returned" },
									{ label: "Delivered", value: "delivered" },
									{ label: "Shipped", value: "shipped" },
								]}
								onValueChange={(value) => setFilterStatus(value)}
							/>
						</div>
						{/* Sort by dropdown */}
						<div className="flex-shrink-0 flex flex-col gap-1">
							<label
								htmlFor="sort"
								className="block text-sm font-medium text-gray-700 mb-1">
								Sort by
							</label>
							<SelectComponent
								defaultValue="newest"
								options={[
									{ label: "Newest", value: "newest" },
									{ label: "Oldest", value: "oldest" },
									{ label: "Highest Total", value: "highest" },
									{ label: "Lowest Total", value: "lowest" },
								]}
								onValueChange={(value) => setSortOption(value)}
							/>
						</div>
					</div>
					{/* Search input field */}
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
				<div className="flex flex-col gap-4">
					{filteredOrders.map((order) => (
						<OrderDetail key={order._id} order={order} />
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
