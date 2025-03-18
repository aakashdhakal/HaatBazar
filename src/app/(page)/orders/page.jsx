"use client";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { getOrders } from "@/app/(server)/actions/order";
import OrderDetail from "@/components/OrderDetail";
import SelectComponent from "@/components/Select";
import { decodeData } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { updatePaymentStatus } from "@/app/(server)/actions/order";
import { clearCart } from "@/app/(server)/actions/cart";

/**
 * OrdersPage Component - Renders a page displaying a user's order history
 *
 * This component provides functionality to:
 * - Display a list of orders with their details
 * - Filter orders by status (pending, paid, delivered, etc.)
 * - Sort orders by date or total amount
 * - Search orders by ID or product name  */
export default function OrdersPage() {
	//get the search params

	// State to store the list of orders
	const [orders, setOrders] = useState([]);
	// State to track loading status during API calls
	const [loading, setLoading] = useState(true);
	// State to track the selected filter status (default: "all")
	const [filterStatus, setFilterStatus] = useState("all");
	// State to track the selected sort option (default: "newest")
	const [sortOption, setSortOption] = useState("newest");
	// State to store the current search query
	const [searchQuery, setSearchQuery] = useState("");
	//State to chang order status
	const [orderStatus, setOrderStatus] = useState("");
	const parameters = useSearchParams();

	useEffect(() => {
		const changeOrderStatus = async (orderId, status) => {
			try {
				await clearCart();
				await updatePaymentStatus(orderId, status);
			} catch (error) {
				console.error("Error updating order status:", error);
			}
		};
		if (parameters.has("data") || parameters.has("status")) {
			const searchParams = decodeData(parameters.get("data"));
			console.log(searchParams.status);
			switch (searchParams.status) {
				case "COMPLETE":
					//return order details from order array whose transactionUid matches searchParams.transactionUid
					if (orders.length > 0) {
						const latestOrder = orders.find(
							(order) =>
								order.paymentInfo.transactionUuid ===
								searchParams.transaction_uuid,
						);

						if (latestOrder && latestOrder.status !== "paid") {
							console.log(latestOrder._id);
							changeOrderStatus(latestOrder._id, "paid");
						}
					}
			}
		}
	}, [orders, parameters]);

	// Effect hook to fetch orders data when component mounts
	useEffect(() => {
		// Async function to fetch orders from API
		const fetchOrders = async () => {
			try {
				// Set loading state to true before fetching
				setLoading(true);
				// Fetch orders data using the getOrders API function
				const ordersData = await getOrders();
				// Update orders state with the fetched data
				setOrders(ordersData);
			} catch (error) {
				// Log any errors that occur during fetching
				console.error("Error fetching orders:", error);
			} finally {
				// Set loading state to false when fetch completes (success or failure)
				setLoading(false);
			}
		};
		// Call the fetch function
		fetchOrders();
	}, []); // Empty dependency array means this runs once on mount

	// Filter and sort orders based on current filter, sort, and search states
	const filteredOrders = orders
		.filter((order) => {
			// Filter out orders that don't match the selected status
			if (filterStatus !== "all" && order.status !== filterStatus) return false;

			// Apply search filter if a search query exists
			if (searchQuery) {
				// Convert search query to lowercase for case-insensitive comparison
				const query = searchQuery.toLowerCase();
				// Check if order ID includes the search query
				const matchesOrderId = order._id
					.toString()
					.toLowerCase()
					.includes(query);
				// Check if any product name in the order includes the search query
				const matchesItems = order.products.some((item) =>
					item.product.name.toLowerCase().includes(query),
				);
				// Return true if either the ID or any product matches
				return matchesOrderId || matchesItems;
			}

			// If no search query and status filter passes, include the order
			return true;
		})
		.sort((a, b) => {
			// Convert createdAt timestamps to Date objects for comparison
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);

			switch (sortOption) {
				case "oldest":
					// Sort by oldest date (ascending order)
					return dateA - dateB;
				case "highest":
					// Sort by highest total amount (descending order)
					return b.total - a.total;
				case "lowest":
					// Sort by lowest total amount (ascending order)
					return a.total - b.total;
				case "newest":
				default:
					// Sort by newest date (descending order) as default
					return;
			}
		});

	// Render the component UI
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{/* Page header with title and description */}
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
					<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
						{/* Filter by Status dropdown */}
						<div className="flex-shrink-0">
							<label
								htmlFor="filter"
								className="block text-sm font-medium text-gray-700 mb-1">
								Filter by Status
							</label>
							<SelectComponent
								defaultValue="all"
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
						<div className="flex-shrink-0">
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
							{/* Search icon */}
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Icon icon="mdi:magnify" className="h-5 w-5 text-gray-400" />
							</div>
							{/* Search input with two-way binding to searchQuery state */}
							<Input
								type="text"
								id="search"
								placeholder="Search by order ID or item name"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-2 border-gray-200 bg-gray-50 focus:bg-white rounded-lg w-full"
							/>
							{/* Clear search button, only visible when search has content */}
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

			{/* Orders List with conditional rendering based on loading and results */}
			{loading ? (
				// Loading spinner shown while fetching orders
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
					<p className="text-gray-600">Loading your orders...</p>
				</div>
			) : filteredOrders.length > 0 ? (
				// If orders exist after filtering, map through and render each one
				<div className="space-y-6">
					{filteredOrders.map((order) => (
						<OrderDetail key={order._id} order={order} />
					))}
				</div>
			) : (
				// Empty state when no orders match filters or user has no orders
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
					{/* Conditional message based on whether filters are active */}
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
					{/* Call to action button to start shopping */}
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
