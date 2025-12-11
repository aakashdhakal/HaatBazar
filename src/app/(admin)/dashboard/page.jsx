import { auth } from "@/app/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
	CalendarIcon,
	LineChartIcon,
	ShoppingBagIcon,
	UsersIcon,
	BoxIcon,
	AlertTriangleIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	ChevronRightIcon,
} from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import InfoCard from "@/components/dashboard/InfoCard";
import { formatCurrency, formatDate } from "@/lib/utils";

// Database interactions
import { getAllOrders } from "@/app/(server)/actions/order";
import getAllProducts from "@/app/(server)/actions/products";
import { getAllUsers } from "@/app/(server)/actions/users";

async function getDashboardData() {
	try {
		// Fetch all required data in parallel
		const [orders, products, users] = await Promise.all([
			getAllOrders(),
			getAllProducts(),
			getAllUsers(),
		]);

		// Current date for today's data
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Yesterday for comparison
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// Calculate statistics from orders
		const todayOrders = orders.filter((order) => {
			const orderDate = new Date(order.createdAt);
			orderDate.setHours(0, 0, 0, 0);
			return orderDate.getTime() === today.getTime();
		});

		const yesterdayOrders = orders.filter((order) => {
			const orderDate = new Date(order.createdAt);
			orderDate.setHours(0, 0, 0, 0);
			return orderDate.getTime() === yesterday.getTime();
		});

		// Calculate daily sales
		const dailySales = todayOrders.reduce(
			(sum, order) => sum + (order.totalAmount || 0),
			0,
		);
		const yesterdaySales = yesterdayOrders.reduce(
			(sum, order) => sum + (order.totalAmount || 0),
			0,
		);

		// Calculate revenue change percentage
		const revenueChange =
			yesterdaySales === 0
				? 100
				: ((dailySales - yesterdaySales) / yesterdaySales) * 100;

		// Calculate order counts
		const dailyOrderCount = todayOrders.length;
		const yesterdayOrderCount = yesterdayOrders.length;
		const ordersChange =
			yesterdayOrderCount === 0
				? 100
				: ((dailyOrderCount - yesterdayOrderCount) / yesterdayOrderCount) * 100;

		// Pending orders
		const pendingOrders = orders.filter(
			(order) => order.status === "processing" || order.status === "pending",
		).length;

		// New users today
		const newUsers = users.filter((user) => {
			if (!user.createdAt) return false;
			const userCreatedDate = new Date(user.createdAt);
			userCreatedDate.setHours(0, 0, 0, 0);
			return userCreatedDate.getTime() === today.getTime();
		}).length;

		// Recent orders (last 5)
		const recentOrders = orders
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 5)
			.map((order) => ({
				id: order._id,
				customer: order.billingAddress?.name || "Anonymous",
				email: order.billingAddress?.email || "N/A",
				date: order.createdAt,
				total: order.totalAmount || 0,
				status: order.status || "processing",
			}));

		// Low stock items
		const lowStockItems = products
			.filter((product) => {
				const stockLevel = product.countInStock || 0;
				const threshold = product.lowStockThreshold || 10;
				return stockLevel <= threshold && stockLevel > 0;
			})
			.slice(0, 5)
			.map((product) => ({
				id: product._id,
				name: product.name,
				category: product.category || "Uncategorized",
				stock: product.countInStock || 0,
				threshold: product.lowStockThreshold || 10,
				image: product.image,
			}));

		// Out of stock count
		const outOfStockCount = products.filter(
			(p) => !p.countInStock || p.countInStock === 0,
		).length;

		return {
			stats: {
				dailySales,
				dailyOrders: dailyOrderCount,
				pendingOrders,
				newUsers,
				lowStockItemsCount: lowStockItems.length,
				outOfStockCount,
				revenueChange,
				ordersChange,
				totalOrders: orders.length,
				totalProducts: products.length,
				totalUsers: users.length,
			},
			recentOrders,
			lowStockItems,
		};
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return {
			stats: {
				dailySales: 0,
				dailyOrders: 0,
				pendingOrders: 0,
				newUsers: 0,
				lowStockItemsCount: 0,
				outOfStockCount: 0,
				revenueChange: 0,
				ordersChange: 0,
				totalOrders: 0,
				totalProducts: 0,
				totalUsers: 0,
			},
			recentOrders: [],
			lowStockItems: [],
		};
	}
}

export default async function Dashboard() {
	const session = await auth();
	const { stats, recentOrders, lowStockItems } = await getDashboardData();

	return (
		<div className="space-y-6">
			{/* Welcome section */}
			<div className="flex justify-between items-center">
				<div className="space-y-4">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back, {session?.user?.name || "Admin"}
					</h1>
					<p className="text-muted-foreground">
						Here&apos;s an overview of your store&apos;s performance today
					</p>
				</div>
				<div className="hidden md:flex items-center gap-2">
					<Button variant="outline" size="sm" className="gap-1">
						<CalendarIcon className="h-4 w-4" />
						<span>Today</span>
					</Button>
					<Button variant="outline" size="sm">
						Export
					</Button>
				</div>
			</div>

			{/* Key metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Daily Sales Card */}
				<InfoCard
					title="Daily Sales"
					value={formatCurrency(stats.dailySales)}
					description={`${
						stats.revenueChange >= 0 ? "+" : ""
					}${stats.revenueChange.toFixed(1)}% from yesterday`}
					icon="lucide:chart-line"
					trend={stats.revenueChange}
				/>

				{/* Orders Card */}
				<InfoCard
					title="Orders"
					value={stats.dailyOrders}
					description={`${
						stats.ordersChange >= 0 ? "+" : ""
					}${stats.ordersChange.toFixed(1)}% from yesterday`}
					icon="feather:shopping-bag"
					trend={stats.ordersChange}
				/>

				{/* Pending Orders Card */}
				<InfoCard
					title="Pending Orders"
					value={stats.pendingOrders}
					description="Orders awaiting processing"
					icon="material-symbols:timer-outline-rounded"
					isTrendNegative={stats.pendingOrders > 5}
				/>

				{/* New Customers Card */}
				<InfoCard
					title="New Customers"
					value={stats.newUsers}
					description="Customers registered today"
					icon="solar:user-outline"
				/>
			</div>

			{/* Overview Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Overview</h2>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					{/* Recent Orders */}
					<Card className="col-span-1">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="space-y-0.5">
								<CardTitle className="text-xl">Recent Orders</CardTitle>
								<CardDescription>
									{recentOrders.length} orders recently
								</CardDescription>
							</div>
							{/* FIX: Change Button+asChild+Link to Link+Button */}
							<Link href="/dashboard/orders">
								<Button variant="outline" size="sm">
									View All
								</Button>
							</Link>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentOrders.length > 0 ? (
									recentOrders.map((order) => (
										<div
											key={order.id}
											className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<UserAvatar
													fallback={order.customer?.substring(0, 2)}
													size={8}
												/>
												<div>
													<p className="text-sm font-medium">
														{order.customer}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatDate(order.date)}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span className="text-sm font-medium">
													{formatCurrency(order.total)}
												</span>
												<Badge
													variant={
														order.status === "delivered" ||
														order.status === "completed"
															? "outline"
															: "secondary"
													}
													className={
														order.status === "cancelled" ||
														order.status === "returned"
															? "bg-red-50 text-red-600 border-red-200"
															: order.status === "delivered" ||
															  order.status === "completed"
															? "bg-green-50 text-green-600 border-green-200"
															: "bg-blue-50 text-blue-600 border-blue-200"
													}>
													{order.status}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-4 text-muted-foreground">
										No recent orders found
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Low Stock Items */}
					<Card className="col-span-1">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="space-y-0.5">
								<CardTitle className="text-xl">Low Stock Alerts</CardTitle>
								<CardDescription>Items that need restocking</CardDescription>
							</div>
							{/* FIX: Change Button+asChild+Link to Link+Button */}
							<Link href="/dashboard/products">
								<Button variant="outline" size="sm">
									View All
								</Button>
							</Link>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{lowStockItems.length > 0 ? (
									lowStockItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="bg-amber-100 p-2 rounded-md">
													<BoxIcon className="h-5 w-5 text-amber-600" />
												</div>
												<div>
													<p className="text-sm font-medium">{item.name}</p>
													<p className="text-xs text-muted-foreground">
														{item.category}
													</p>
												</div>
											</div>
											<div className="flex items-center">
												<Badge
													variant="outline"
													className="bg-red-50 text-red-600 border-red-200">
													{item.stock}/{item.threshold}
												</Badge>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-4 text-muted-foreground">
										No low stock items found
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Business Overview Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Total Orders
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalOrders}</div>
							<p className="text-xs text-muted-foreground mt-1">
								All-time orders processed
							</p>
							<div className="mt-4">
								<Link
									href="/dashboard/orders"
									className="text-xs text-primary flex items-center">
									View all orders
									<ChevronRightIcon className="ml-1 h-3 w-3" />
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Total Products
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalProducts}</div>
							<p className="text-xs text-muted-foreground mt-1">
								{stats.outOfStockCount} out of stock
							</p>
							<div className="mt-4">
								<Link
									href="/dashboard/products"
									className="text-xs text-primary flex items-center">
									Manage inventory
									<ChevronRightIcon className="ml-1 h-3 w-3" />
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Total Customers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalUsers}</div>
							<p className="text-xs text-muted-foreground mt-1">
								{stats.newUsers} new today
							</p>
							<div className="mt-4">
								<Link
									href="/dashboard/customers"
									className="text-xs text-primary flex items-center">
									View all customers
									<ChevronRightIcon className="ml-1 h-3 w-3" />
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sales Chart */}
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Sales Overview</CardTitle>
						<CardDescription>Your monthly sales performance</CardDescription>
					</CardHeader>
					<CardContent className="h-[300px] flex items-center justify-center">
						<div className="text-center space-y-2 text-muted-foreground">
							<LineChartIcon className="mx-auto h-16 w-16 opacity-50" />
							<p>Sales chart will be displayed here</p>
							<p className="text-xs">
								Data is being collected - charts will appear soon
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity & Quick Actions */}
			<div className="grid gap-4 md:grid-cols-7">
				{/* Recent Activity */}
				<Card className="md:col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						{recentOrders.length > 0 ? (
							<div className="space-y-4">
								{/* New customer registered */}
								{stats.newUsers > 0 && (
									<div className="flex gap-3">
										<div className="relative mt-1">
											<div className="bg-primary/10 rounded-full p-1">
												<UsersIcon className="h-4 w-4 text-primary" />
											</div>
											<div className="absolute top-8 left-1/2 bottom-0 -translate-x-1/2 border-l border-dashed border-muted"></div>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">
												New customer registered
											</p>
											<p className="text-xs text-muted-foreground">
												{stats.newUsers} new customers today
											</p>
											<p className="text-xs text-muted-foreground">Today</p>
										</div>
									</div>
								)}

								{/* New order placed */}
								{recentOrders.length > 0 && (
									<div className="flex gap-3">
										<div className="relative mt-1">
											<div className="bg-green-100 rounded-full p-1">
												<ShoppingBagIcon className="h-4 w-4 text-green-600" />
											</div>
											<div className="absolute top-8 left-1/2 bottom-0 -translate-x-1/2 border-l border-dashed border-muted"></div>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">New order placed</p>
											<p className="text-xs text-muted-foreground">
												Order #
												{recentOrders[0].id
													.substring(recentOrders[0].id.length - 6)
													.toUpperCase()}{" "}
												for {formatCurrency(recentOrders[0].total)}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatDate(recentOrders[0].date)}
											</p>
										</div>
									</div>
								)}

								{/* Low stock alert */}
								{lowStockItems.length > 0 && (
									<div className="flex gap-3">
										<div className="relative mt-1">
											<div className="bg-amber-100 rounded-full p-1">
												<AlertTriangleIcon className="h-4 w-4 text-amber-600" />
											</div>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">Low stock alert</p>
											<p className="text-xs text-muted-foreground">
												{lowStockItems[0].name} is running low on stock
											</p>
											<p className="text-xs text-muted-foreground">
												Current stock: {lowStockItems[0].stock} units
											</p>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-center py-4 text-muted-foreground">
								No recent activity to display
							</div>
						)}
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						{/* FIX: Restructured the quick action buttons to avoid React.Children.only error */}
						<Link href="/dashboard/orders/new">
							<Button
								variant="outline"
								className="h-auto w-full flex flex-col py-4 px-3 justify-center items-center gap-2">
								<ShoppingBagIcon className="h-5 w-5 text-primary" />
								<span className="text-xs font-normal">New Order</span>
							</Button>
						</Link>

						<Link href="/dashboard/products/new">
							<Button
								variant="outline"
								className="h-auto w-full flex flex-col py-4 px-3 justify-center items-center gap-2">
								<BoxIcon className="h-5 w-5 text-primary" />
								<span className="text-xs font-normal">Add Product</span>
							</Button>
						</Link>

						<Link href="/dashboard/customers">
							<Button
								variant="outline"
								className="h-auto w-full flex flex-col py-4 px-3 justify-center items-center gap-2">
								<UsersIcon className="h-5 w-5 text-primary" />
								<span className="text-xs font-normal">Customers</span>
							</Button>
						</Link>

						<Link href="/dashboard/reports">
							<Button
								variant="outline"
								className="h-auto w-full flex flex-col py-4 px-3 justify-center items-center gap-2">
								<CalendarIcon className="h-5 w-5 text-primary" />
								<span className="text-xs font-normal">Reports</span>
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
