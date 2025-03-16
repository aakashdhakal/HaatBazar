"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

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
import InfoCard from "@/components/dashboard/InfoCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Description } from "@radix-ui/react-alert-dialog";

// Mock data for orders
const ordersData = [
	{
		id: "ORD-8945",
		customer: "Rahul Sharma",
		email: "rahul.sharma@example.com",
		date: "2025-03-12T09:30:00.000Z",
		items: 5,
		total: 4250,
		status: "completed",
		payment: "paid",
		paymentMethod: "Card",
	},
	{
		id: "ORD-8944",
		customer: "Priya Patel",
		email: "priya.patel@example.com",
		date: "2025-03-12T08:15:00.000Z",
		items: 3,
		total: 1850,
		status: "processing",
		payment: "paid",
		paymentMethod: "UPI",
	},
	{
		id: "ORD-8943",
		customer: "Amit Kumar",
		email: "amit.kumar@example.com",
		date: "2025-03-11T16:45:00.000Z",
		items: 2,
		total: 980,
		status: "delivered",
		payment: "paid",
		paymentMethod: "Wallet",
	},
	{
		id: "ORD-8942",
		customer: "Neha Gupta",
		email: "neha.gupta@example.com",
		date: "2025-03-11T14:20:00.000Z",
		items: 7,
		total: 6500,
		status: "cancelled",
		payment: "refunded",
		paymentMethod: "Card",
	},
	{
		id: "ORD-8941",
		customer: "Vikram Joshi",
		email: "vikram.joshi@example.com",
		date: "2025-03-11T10:10:00.000Z",
		items: 1,
		total: 450,
		status: "shipped",
		payment: "paid",
		paymentMethod: "COD",
	},
	{
		id: "ORD-8940",
		customer: "Ananya Singh",
		email: "ananya.singh@example.com",
		date: "2025-03-10T18:30:00.000Z",
		items: 4,
		total: 3200,
		status: "delivered",
		payment: "paid",
		paymentMethod: "UPI",
	},
	{
		id: "ORD-8939",
		customer: "Rajesh Verma",
		email: "rajesh.verma@example.com",
		date: "2025-03-10T15:45:00.000Z",
		items: 6,
		total: 5700,
		status: "processing",
		payment: "paid",
		paymentMethod: "Card",
	},
	{
		id: "ORD-8938",
		customer: "Sanya Malhotra",
		email: "sanya.malhotra@example.com",
		date: "2025-03-10T12:15:00.000Z",
		items: 2,
		total: 1250,
		status: "completed",
		payment: "paid",
		paymentMethod: "Wallet",
	},
	{
		id: "ORD-8937",
		customer: "Dhruv Patel",
		email: "dhruv.patel@example.com",
		date: "2025-03-09T17:20:00.000Z",
		items: 3,
		total: 2100,
		status: "returned",
		payment: "refunded",
		paymentMethod: "Card",
	},
	{
		id: "ORD-8936",
		customer: "Meera Shah",
		email: "meera.shah@example.com",
		date: "2025-03-09T11:05:00.000Z",
		items: 5,
		total: 4800,
		status: "delivered",
		payment: "paid",
		paymentMethod: "UPI",
	},
	{
		id: "ORD-8935",
		customer: "Arjun Reddy",
		email: "arjun.reddy@example.com",
		date: "2025-03-08T14:25:00.000Z",
		items: 2,
		total: 1800,
		status: "processing",
		payment: "pending",
		paymentMethod: "COD",
	},
	{
		id: "ORD-8934",
		customer: "Kavya Sharma",
		email: "kavya.sharma@example.com",
		date: "2025-03-08T10:15:00.000Z",
		items: 3,
		total: 2700,
		status: "delivered",
		payment: "paid",
		paymentMethod: "UPI",
	},
];

// Helper function for Status Badge
function OrderStatusBadge({ status }) {
	const statusStyles = {
		processing: {
			variant: "outline",
			className: "bg-blue-50 text-blue-600 border-blue-200",
		},
		completed: {
			variant: "outline",
			className: "bg-green-50 text-green-600 border-green-200",
		},
		delivered: {
			variant: "outline",
			className: "bg-green-50 text-green-600 border-green-200",
		},
		shipped: {
			variant: "outline",
			className: "bg-purple-50 text-purple-600 border-purple-200",
		},
		cancelled: {
			variant: "outline",
			className: "bg-red-50 text-red-600 border-red-200",
		},
		returned: {
			variant: "outline",
			className: "bg-orange-50 text-orange-600 border-orange-200",
		},
	};

	const style = statusStyles[status] || { variant: "outline" };

	return (
		<Badge variant={style.variant} className={style.className}>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	);
}

export default function Orders() {
	// State for search and filtering
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const [selectedRows, setSelectedRows] = useState({});
	const [selectAll, setSelectAll] = useState(false);
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

	// Sorting state
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: "asc",
	});

	// Pagination state
	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerPage] = useState(5);

	// Handle sort request
	const requestSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	// Reset selection when filters change
	useEffect(() => {
		setSelectedRows({});
		setSelectAll(false);
	}, [searchTerm, statusFilter, paymentFilter, currentPage]);

	// Filter and sort data
	const filteredData = ordersData.filter((order) => {
		// Text search
		const searchMatch =
			searchTerm === "" ||
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.email.toLowerCase().includes(searchTerm.toLowerCase());

		// Status filter
		const statusMatch = statusFilter === "all" || order.status === statusFilter;

		// Payment filter
		const paymentMatch =
			paymentFilter === "all" || order.payment === paymentFilter;

		return searchMatch && statusMatch && paymentMatch;
	});

	// Apply sorting
	const sortedData = [...filteredData].sort((a, b) => {
		if (sortConfig.key !== null) {
			if (a[sortConfig.key] < b[sortConfig.key]) {
				return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (a[sortConfig.key] > b[sortConfig.key]) {
				return sortConfig.direction === "asc" ? 1 : -1;
			}
		}
		return 0;
	});

	// Pagination
	const paginatedData = sortedData.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage,
	);
	const pageCount = Math.ceil(sortedData.length / itemsPerPage);

	// Handle row selection
	const toggleRowSelection = (id) => {
		setSelectedRows((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	// Handle select all
	const toggleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);

		const newSelectedRows = {};
		paginatedData.forEach((row) => {
			newSelectedRows[row.id] = newSelectAll;
		});

		setSelectedRows(newSelectedRows);
	};

	// Handle column visibility
	const toggleColumnVisibility = (column) => {
		setVisibleColumns((prev) => ({
			...prev,
			[column]: !prev[column],
		}));
	};

	// Format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-NP", {
			style: "currency",
			currency: "NPR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Count selected rows
	const selectedRowCount = Object.values(selectedRows).filter(Boolean).length;

	// Summary cards data
	const summaryCards = [
		{
			title: "Total Orders",
			value: "124",
			trend: "+8%",
			icon: "mdi:package-variant",
			description: "Total orders placed by customers",
		},
		{
			title: "Processing",
			value: "18",
			trend: "+12%",
			icon: "mdi:clock-outline",
			description: "Orders currently being processed",
		},
		{
			title: "Delivered",
			value: "92",
			trend: "+5%",
			icon: "mdi:check-circle-outline",
			description: "Orders successfully delivered",
		},
		{
			title: "Returns",
			value: "6",
			trend: "-2%",
			icon: "mdi:package-variant-remove",
			description: "Orders returned by customers",
			isTrendNegative: true,
		},
	];

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
					<Button className="gap-1">
						<Icon icon="mdi:plus" className="h-4 w-4" />
						Add Order
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => window.location.reload()}>
						<Icon icon="mdi:refresh" className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Summary cards */}
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
				{summaryCards.map((card, index) => (
					<InfoCard key={index} {...card} />
				))}
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-grow">
					<Icon
						icon="mdi:magnify"
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
					/>
					<Input
						placeholder="Search orders..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-8"
					/>
				</div>
				<div className="flex gap-2 flex-wrap sm:flex-nowrap">
					<Select
						defaultValue="all"
						value={statusFilter}
						onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[120px]">
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

					<Select
						defaultValue="all"
						value={paymentFilter}
						onValueChange={setPaymentFilter}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Payment" />
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
						<Icon icon="mdi:filter-outline" className="h-4 w-4" />
						More Filters
					</Button>

					<Button variant="outline" className="gap-1">
						<Icon icon="mdi:download" className="h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Table visibility toggle */}
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
							checked={visibleColumns.customer}
							onCheckedChange={() => toggleColumnVisibility("customer")}>
							Customer
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.date}
							onCheckedChange={() => toggleColumnVisibility("date")}>
							Date
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.items}
							onCheckedChange={() => toggleColumnVisibility("items")}>
							Items
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.total}
							onCheckedChange={() => toggleColumnVisibility("total")}>
							Total
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.status}
							onCheckedChange={() => toggleColumnVisibility("status")}>
							Status
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={visibleColumns.payment}
							onCheckedChange={() => toggleColumnVisibility("payment")}>
							Payment
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">
								<Checkbox
									checked={selectAll}
									onCheckedChange={toggleSelectAll}
									aria-label="Select all rows"
								/>
							</TableHead>
							{visibleColumns.id && <TableHead>Order ID</TableHead>}
							{visibleColumns.customer && (
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => requestSort("customer")}
										className="flex items-center gap-1">
										Customer
										<Icon icon="mdi:sort" className="h-4 w-4" />
									</Button>
								</TableHead>
							)}
							{visibleColumns.date && <TableHead>Date</TableHead>}
							{visibleColumns.items && <TableHead>Items</TableHead>}
							{visibleColumns.total && (
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => requestSort("total")}
										className="flex items-center gap-1 ml-auto">
										Total
										<Icon icon="mdi:sort" className="h-4 w-4" />
									</Button>
								</TableHead>
							)}
							{visibleColumns.status && <TableHead>Status</TableHead>}
							{visibleColumns.payment && <TableHead>Payment</TableHead>}
							{visibleColumns.actions && (
								<TableHead className="w-[80px]">Actions</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedData.length > 0 ? (
							paginatedData.map((order) => (
								<TableRow
									key={order.id}
									data-state={selectedRows[order.id] ? "selected" : undefined}>
									<TableCell>
										<Checkbox
											checked={!!selectedRows[order.id]}
											onCheckedChange={() => toggleRowSelection(order.id)}
											aria-label={`Select row ${order.id}`}
										/>
									</TableCell>
									{visibleColumns.id && (
										<TableCell>
											<Link
												href={`/dashboard/orders/${order.id}`}
												className="font-medium text-primary hover:underline">
												{order.id}
											</Link>
										</TableCell>
									)}
									{visibleColumns.customer && (
										<TableCell>
											<div className="font-medium">{order.customer}</div>
											<div className="text-xs text-muted-foreground">
												{order.email}
											</div>
										</TableCell>
									)}
									{visibleColumns.date && (
										<TableCell>{formatDate(order.date)}</TableCell>
									)}
									{visibleColumns.items && <TableCell>{order.items}</TableCell>}
									{visibleColumns.total && (
										<TableCell className="text-right font-medium">
											{formatCurrency(order.total)}
										</TableCell>
									)}
									{visibleColumns.status && (
										<TableCell>
											<OrderStatusBadge status={order.status} />
										</TableCell>
									)}
									{visibleColumns.payment && (
										<TableCell>
											<div className="font-medium capitalize">
												{order.payment}
											</div>
											<div className="text-xs text-muted-foreground">
												{order.paymentMethod}
											</div>
										</TableCell>
									)}
									{visibleColumns.actions && (
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Open menu</span>
														<Icon
															icon="mdi:dots-horizontal"
															className="h-4 w-4"
														/>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() =>
															navigator.clipboard.writeText(order.id)
														}>
														Copy Order ID
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem>
														<Link href={`/dashboard/orders/${order.id}`}>
															View Details
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem>Update Status</DropdownMenuItem>
													<DropdownMenuItem>Send Invoice</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-red-600">
														Cancel Order
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									)}
								</TableRow>
							))
						) : (
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
										<span>No orders found.</span>
										<span className="text-sm">
											Try adjusting your search or filters
										</span>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="text-sm text-muted-foreground">
					{selectedRowCount} of {filteredData.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-2 ml-auto">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setCurrentPage(0)}
						disabled={currentPage === 0}
						className="hidden sm:flex gap-1">
						<Icon icon="mdi:page-first" className="h-4 w-4" />
						First
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
						disabled={currentPage === 0}
						className="gap-1">
						<Icon icon="mdi:chevron-left" className="h-4 w-4" />
						Previous
					</Button>
					<span className="flex items-center gap-1 text-sm">
						<strong>{currentPage + 1}</strong> of
						<strong>{pageCount || 1}</strong>
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
						}
						disabled={currentPage >= pageCount - 1}
						className="gap-1">
						Next
						<Icon icon="mdi:chevron-right" className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setCurrentPage(pageCount - 1)}
						disabled={currentPage >= pageCount - 1}
						className="hidden sm:flex gap-1">
						Last
						<Icon icon="mdi:page-last" className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
