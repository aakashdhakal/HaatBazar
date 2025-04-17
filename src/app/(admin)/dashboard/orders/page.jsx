"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import InfoCard from "@/components/dashboard/InfoCard";
import AlertDialogComponent from "@/components/AlertDialog";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAllOrders, updateOrderStatus } from "@/app/(server)/actions/order";

export default function Orders() {
	const router = useRouter();
	const { toast } = useToast();

	// State
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrders, setSelectedOrders] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [visibleColumns, setVisibleColumns] = useState({
		id: true,
		customer: true,
		date: true,
		items: true,
		total: true,
		status: true,
		payment: true,
		actions: true,
	});

	// Fetch orders from database
	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const data = await getAllOrders();
				if (data && Array.isArray(data)) {
					setOrders(data);
				} else {
					toast({
						variant: "destructive",
						title: "Error",
						description: "Failed to fetch orders",
					});
				}
			} catch (error) {
				console.error("Error fetching orders:", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to fetch orders",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [toast]);

	// Reset selection when filters change
	useEffect(() => {
		setSelectedOrders([]);
	}, [searchTerm, statusFilter, paymentFilter, currentPage]);

	// Filter and sort orders
	const filteredOrders = orders.filter((order) => {
		// Text search - check ID, customer name, email
		const searchMatch =
			searchTerm === "" ||
			(order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(order._id &&
				order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(order.billingAddress?.name &&
				order.billingAddress.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(order.billingAddress?.email &&
				order.billingAddress.email
					.toLowerCase()
					.includes(searchTerm.toLowerCase()));

		// Status filter
		const statusMatch = statusFilter === "all" || order.status === statusFilter;

		// Payment filter
		const paymentMatch =
			paymentFilter === "all" ||
			(order.paymentInfo && order.paymentInfo.status === paymentFilter);

		return searchMatch && statusMatch && paymentMatch;
	});

	// Pagination
	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedOrders = filteredOrders.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	// Toggle order selection
	const toggleOrderSelection = (orderId) => {
		setSelectedOrders((prev) =>
			prev.includes(orderId)
				? prev.filter((id) => id !== orderId)
				: [...prev, orderId],
		);
	};

	// Toggle all orders selection
	const toggleAllOrders = (checked) => {
		if (checked) {
			setSelectedOrders([
				...new Set([
					...selectedOrders,
					...paginatedOrders.map((order) => order._id),
				]),
			]);
		} else {
			setSelectedOrders(
				selectedOrders.filter(
					(id) => !paginatedOrders.find((order) => order._id === id),
				),
			);
		}
	};

	// Handle order status update
	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			setLoading(true);
			await updateOrderStatus(orderId, newStatus);

			// Update local state
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order._id === orderId ? { ...order, status: newStatus } : order,
				),
			);

			toast({
				title: "Status updated",
				description: "Order status has been updated successfully",
				variant: "success",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update order status",
			});
		} finally {
			setLoading(false);
		}
	};

	// Handle bulk status update
	const bulkUpdateStatus = async (status) => {
		try {
			setLoading(true);

			// Update each selected order
			await Promise.all(
				selectedOrders.map((orderId) => updateOrderStatus(orderId, status)),
			);

			// Update local state
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					selectedOrders.includes(order._id) ? { ...order, status } : order,
				),
			);

			setSelectedOrders([]);

			toast({
				title: "Orders updated",
				description: `Status updated for ${selectedOrders.length} orders`,
				variant: "success",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update orders",
			});
		} finally {
			setLoading(false);
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setPaymentFilter("all");
	};

	// Calculate summary data
	const summaryData = {
		total: orders.length,
		processing: orders.filter((order) => order.status === "processing").length,
		delivered: orders.filter(
			(order) => order.status === "delivered" || order.status === "completed",
		).length,
		returned: orders.filter(
			(order) => order.status === "returned" || order.status === "cancelled",
		).length,
	};

	// Get total revenue
	const totalRevenue = orders.reduce((sum, order) => {
		return sum + (order.totalAmount || 0);
	}, 0);

	return (
		<div className="space-y-6">
			{/* Page header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Orders</h1>
					<p className="text-muted-foreground mt-1">
						Manage and process customer orders
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => window.location.reload()}
						className="h-9 w-9">
						<Icon icon="mdi:refresh" className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<InfoCard
					title="Total Orders"
					value={summaryData.total.toString()}
					icon="mdi:package-variant"
					description="All orders"
				/>
				<InfoCard
					title="Processing"
					value={summaryData.processing.toString()}
					icon="mdi:clock-outline"
					description="Orders being processed"
				/>
				<InfoCard
					title="Delivered"
					value={summaryData.delivered.toString()}
					icon="mdi:check-circle-outline"
					description="Successfully delivered"
				/>
				<InfoCard
					title="Returns/Cancelled"
					value={summaryData.returned.toString()}
					icon="mdi:package-variant-remove"
					description="Problem orders"
					isTrendNegative={true}
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-grow">
					<Icon
						icon="mdi:magnify"
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
					/>
					<Input
						placeholder="Search by order ID, customer name, or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="processing">Processing</SelectItem>
							<SelectItem value="shipped">Shipped</SelectItem>
							<SelectItem value="delivered">Delivered</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
							<SelectItem value="returned">Returned</SelectItem>
						</SelectContent>
					</Select>

					<Select value={paymentFilter} onValueChange={setPaymentFilter}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Payment Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Payments</SelectItem>
							<SelectItem value="paid">Paid</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="refunded">Refunded</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline" className="gap-1">
						<Icon icon="mdi:calendar" className="h-4 w-4" />
						Date Range
					</Button>

					<Button variant="outline" className="gap-1">
						<Icon icon="mdi:download" className="h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Column visibility */}
			<div className="flex items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="gap-1 ml-auto">
							<Icon icon="mdi:eye-outline" className="h-4 w-4" />
							View
							<Icon icon="mdi:chevron-down" className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuCheckboxItem
							checked={visibleColumns.id}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({ ...prev, id: !prev.id }))
							}>
							Order ID
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.customer}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({
									...prev,
									customer: !prev.customer,
								}))
							}>
							Customer
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.date}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({ ...prev, date: !prev.date }))
							}>
							Date
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.items}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({ ...prev, items: !prev.items }))
							}>
							Items
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.total}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({ ...prev, total: !prev.total }))
							}>
							Total
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.status}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({ ...prev, status: !prev.status }))
							}>
							Status
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.payment}
							onCheckedChange={() =>
								setVisibleColumns((prev) => ({
									...prev,
									payment: !prev.payment,
								}))
							}>
							Payment
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Bulk actions bar */}
			{selectedOrders.length > 0 && (
				<div className="bg-primary/10 p-3 rounded-lg flex flex-wrap items-center justify-between">
					<span className="text-sm font-medium">
						{selectedOrders.length} orders selected
					</span>
					<div className="flex gap-2 mt-2 sm:mt-0">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									Update Status
									<Icon icon="mdi:chevron-down" className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => bulkUpdateStatus("processing")}>
									Mark as Processing
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => bulkUpdateStatus("shipped")}>
									Mark as Shipped
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => bulkUpdateStatus("delivered")}>
									Mark as Delivered
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => bulkUpdateStatus("completed")}>
									Mark as Completed
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => bulkUpdateStatus("cancelled")}
									className="text-red-600">
									Mark as Cancelled
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button variant="outline" size="sm">
							<Icon icon="mdi:printer" className="mr-2 h-4 w-4" />
							Print Invoices
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSelectedOrders([])}>
							Deselect All
						</Button>
					</div>
				</div>
			)}

			{/* Orders table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">
								<Checkbox
									checked={
										paginatedOrders.length > 0 &&
										paginatedOrders.every((order) =>
											selectedOrders.includes(order._id),
										)
									}
									onCheckedChange={toggleAllOrders}
									aria-label="Select all orders"
								/>
							</TableHead>
							{visibleColumns.id && <TableHead>Order ID</TableHead>}
							{visibleColumns.customer && <TableHead>Customer</TableHead>}
							{visibleColumns.date && <TableHead>Date</TableHead>}
							{visibleColumns.items && (
								<TableHead className="text-center">Items</TableHead>
							)}
							{visibleColumns.total && (
								<TableHead className="text-right">Total</TableHead>
							)}
							{visibleColumns.status && <TableHead>Status</TableHead>}
							{visibleColumns.payment && <TableHead>Payment</TableHead>}
							{visibleColumns.actions && (
								<TableHead className="w-[100px] text-right">Actions</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							// Loading skeletons
							Array.from({ length: itemsPerPage }).map((_, index) => (
								<TableRow key={`skeleton-${index}`}>
									<TableCell>
										<Skeleton className="h-4 w-4" />
									</TableCell>
									{visibleColumns.id && (
										<TableCell>
											<Skeleton className="h-5 w-20" />
										</TableCell>
									)}
									{visibleColumns.customer && (
										<TableCell>
											<div className="space-y-1">
												<Skeleton className="h-4 w-24" />
												<Skeleton className="h-3 w-32" />
											</div>
										</TableCell>
									)}
									{visibleColumns.date && (
										<TableCell>
											<Skeleton className="h-4 w-24" />
										</TableCell>
									)}
									{visibleColumns.items && (
										<TableCell className="text-center">
											<Skeleton className="h-4 w-8 mx-auto" />
										</TableCell>
									)}
									{visibleColumns.total && (
										<TableCell className="text-right">
											<Skeleton className="h-4 w-16 ml-auto" />
										</TableCell>
									)}
									{visibleColumns.status && (
										<TableCell>
											<Skeleton className="h-6 w-20" />
										</TableCell>
									)}
									{visibleColumns.payment && (
										<TableCell>
											<div className="space-y-1">
												<Skeleton className="h-4 w-16" />
												<Skeleton className="h-3 w-12" />
											</div>
										</TableCell>
									)}
									{visibleColumns.actions && (
										<TableCell className="text-right">
											<div className="flex justify-end space-x-1">
												<Skeleton className="h-8 w-8" />
												<Skeleton className="h-8 w-8" />
											</div>
										</TableCell>
									)}
								</TableRow>
							))
						) : paginatedOrders.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={
										Object.values(visibleColumns).filter(Boolean).length + 1
									}
									className="h-24 text-center">
									<div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
										<Icon
											icon="mdi:package-variant-remove"
											className="h-8 w-8 opacity-40"
										/>
										<span>No orders found</span>
										<span className="text-sm">
											{searchTerm ||
											statusFilter !== "all" ||
											paymentFilter !== "all"
												? "Try adjusting your search or filters"
												: "There are no orders to display"}
										</span>
										{(searchTerm ||
											statusFilter !== "all" ||
											paymentFilter !== "all") && (
											<Button
												variant="outline"
												size="sm"
												onClick={clearFilters}
												className="mt-2">
												Clear Filters
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						) : (
							paginatedOrders.map((order) => (
								<TableRow
									key={order._id}
									className={
										selectedOrders.includes(order._id)
											? "bg-accent/5 hover:bg-accent/10"
											: ""
									}>
									<TableCell>
										<Checkbox
											checked={selectedOrders.includes(order._id)}
											onCheckedChange={() => toggleOrderSelection(order._id)}
											aria-label={`Select order ${order._id}`}
										/>
									</TableCell>
									{visibleColumns.id && (
										<TableCell>
											<Link
												href={`/dashboard/orders/${order._id}`}
												className="font-medium text-primary hover:underline">
												#
												{order._id
													.substring(order._id.length - 6)
													.toUpperCase()}
											</Link>
										</TableCell>
									)}
									{visibleColumns.customer && (
										<TableCell>
											<div className="font-medium">
												{order.billingAddress?.name || "N/A"}
											</div>
											<div className="text-xs text-muted-foreground">
												{order.billingAddress?.email || "No email"}
											</div>
										</TableCell>
									)}
									{visibleColumns.date && (
										<TableCell>
											{order.createdAt ? formatDate(order.createdAt) : "N/A"}
										</TableCell>
									)}
									{visibleColumns.items && (
										<TableCell className="text-center">
											{order.products?.length || 0}
										</TableCell>
									)}
									{visibleColumns.total && (
										<TableCell className="text-right font-medium">
											{formatCurrency(order.totalAmount || 0)}
										</TableCell>
									)}
									{visibleColumns.status && (
										<TableCell>
											<StatusBadge status={order.status || "processing"} />
										</TableCell>
									)}
									{visibleColumns.payment && (
										<TableCell>
											<div className="font-medium capitalize">
												{order.paymentInfo?.status || "unknown"}
											</div>
											<div className="text-xs text-muted-foreground">
												{order.paymentInfo?.paymentMethod || "N/A"}
											</div>
										</TableCell>
									)}
									{visibleColumns.actions && (
										<TableCell className="text-right">
											<div className="flex justify-end gap-1">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
															aria-label="Open menu">
															<Icon
																icon="mdi:dots-vertical"
																className="h-4 w-4"
															/>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuItem
															onClick={() =>
																router.push(`/dashboard/orders/${order._id}`)
															}>
															View Details
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order._id, "processing")
															}>
															Mark as Processing
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order._id, "shipped")
															}>
															Mark as Shipped
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order._id, "delivered")
															}>
															Mark as Delivered
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order._id, "completed")
															}>
															Mark as Completed
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order._id, "cancelled")
															}
															className="text-red-600">
															Cancel Order
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														router.push(`/dashboard/orders/${order._id}`)
													}>
													<Icon icon="mdi:eye-outline" className="h-4 w-4" />
													<span className="sr-only">View details</span>
												</Button>
											</div>
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{!loading && filteredOrders.length > 0 && (
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div className="text-sm text-muted-foreground">
						{selectedOrders.length > 0
							? `${selectedOrders.length} of ${filteredOrders.length} orders selected`
							: `Showing ${startIndex + 1} to ${Math.min(
									startIndex + itemsPerPage,
									filteredOrders.length,
							  )} of ${filteredOrders.length} orders`}
					</div>
					<div className="flex items-center space-x-2 ml-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(1)}
							disabled={currentPage === 1}
							className="hidden sm:flex gap-1">
							<Icon icon="mdi:page-first" className="h-4 w-4" />
							First
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
							className="gap-1">
							<Icon icon="mdi:chevron-left" className="h-4 w-4" />
							Previous
						</Button>
						<span className="flex items-center gap-1 text-sm">
							<strong>{currentPage}</strong> of{" "}
							<strong>{totalPages || 1}</strong>
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setCurrentPage((prev) => Math.min(totalPages, prev + 1))
							}
							disabled={currentPage >= totalPages}
							className="gap-1">
							Next
							<Icon icon="mdi:chevron-right" className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(totalPages)}
							disabled={currentPage >= totalPages}
							className="hidden sm:flex gap-1">
							Last
							<Icon icon="mdi:page-last" className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
