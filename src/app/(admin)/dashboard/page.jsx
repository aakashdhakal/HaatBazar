import { auth } from "@/app/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	CalendarIcon,
	LineChartIcon,
	ShoppingBagIcon,
	UsersIcon,
	BoxIcon,
	AlertTriangleIcon,
} from "lucide-react";

import UserAvatar from "@/components/UserAvatar";

import InfoCard from "@/components/dashboard/InfoCard";
import { formatCurrency, formatDate } from "@/lib/utils";

// This would be replaced with real data from your database
async function getStats() {
	return {
		dailySales: 12450,
		dailyOrders: 42,
		pendingOrders: 8,
		newCustomers: 17,
		lowStockItems: 5,
		revenueChange: 8.2,
		ordersChange: 12.5,
		customersChange: 24.1,
	};
}

async function getRecentOrders() {
	return [
		{
			id: "ORD-7893",
			customer: "Rahul Sharma",
			date: "2025-03-13T09:18:00",
			total: 1240,
			status: "processing",
		},
		{
			id: "ORD-7892",
			customer: "Priya Patel",
			date: "2025-03-13T08:05:00",
			total: 860,
			status: "delivered",
		},
		{
			id: "ORD-7891",
			customer: "Amit Singh",
			date: "2025-03-12T16:48:00",
			total: 2150,
			status: "processing",
		},
		{
			id: "ORD-7890",
			customer: "Neha Gupta",
			date: "2025-03-12T14:32:00",
			total: 540,
			status: "delivered",
		},
		{
			id: "ORD-7889",
			customer: "Vikram Joshi",
			date: "2025-03-12T10:15:00",
			total: 1780,
			status: "delivered",
		},
	];
}

async function getLowStockItems() {
	return [
		{
			id: "P-123",
			name: "Organic Tomatoes",
			category: "Vegetables",
			stock: 3,
			threshold: 10,
		},
		{
			id: "P-256",
			name: "Fresh Spinach",
			category: "Leafy Greens",
			stock: 2,
			threshold: 8,
		},
		{
			id: "P-189",
			name: "Brown Rice",
			category: "Grains",
			stock: 4,
			threshold: 15,
		},
		{
			id: "P-342",
			name: "Organic Apples",
			category: "Fruits",
			stock: 5,
			threshold: 12,
		},
		{
			id: "P-567",
			name: "Free-Range Eggs",
			category: "Dairy",
			stock: 6,
			threshold: 20,
		},
	];
}

export default async function Dashboard() {
	const session = await auth();
	const stats = await getStats();
	const recentOrders = await getRecentOrders();
	const lowStockItems = await getLowStockItems();

	return (
		<div className="space-y-6">
			{/* Welcome section */}
			<div className="flex justify-between items-center">
				<div className="space-y-4">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back, {session.user.name}
					</h1>
					<p className="text-muted-foreground">
						Here&apos;s an overview of your store&apos;s performance today
					</p>
				</div>
				<div className="hidden md:flex items-center gap-2">
					<Button variant="outline" size="sm" className="gap-1">
						<CalendarIcon className="h-4 w-4" />
						Today
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
					description="Total revenue today"
					icon="lucide:chart-line"
				/>

				{/* Orders Card */}
				<InfoCard
					title="Orders"
					value={stats.dailyOrders}
					description="Total orders placed today"
					icon="feather:shopping-bag"
				/>

				{/* Customers Card */}
				<InfoCard
					title="Pending Orders"
					value={stats.pendingOrders}
					description="Orders awaiting processing"
					icon="material-symbols:timer-outline-rounded"
				/>

				{/* Inventory Alert Card */}
				<InfoCard
					title="New Customers"
					value={stats.newCustomers}
					description="Customers registered today"
					icon="solar:user-outline"
				/>
			</div>

			{/* Tabs for different sections */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="customers">Customers</TabsTrigger>
				</TabsList>

				{/* Overview Tab Content */}
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Recent Orders */}
						<Card className="col-span-1">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<div className="space-y-0.5">
									<CardTitle className="text-xl">Recent Orders</CardTitle>
									<CardDescription>
										{recentOrders.length} orders today
									</CardDescription>
								</div>
								<Button variant="outline" size="sm">
									View All
								</Button>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentOrders.map((order) => (
										<div
											key={order.id}
											className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<UserAvatar src={order.customer.avatar} size={8} />

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
														order.status === "delivered"
															? "outline"
															: "secondary"
													}>
													{order.status}
												</Badge>
											</div>
										</div>
									))}
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
								<Button variant="outline" size="sm">
									View All
								</Button>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{lowStockItems.map((item) => (
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
									))}
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
									Connect your data source to see real-time charts
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value="orders"
					className="h-[400px] flex items-center justify-center text-muted-foreground">
					<div className="text-center">
						<ShoppingBagIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
						<h3 className="text-lg font-medium">Orders Management</h3>
						<p className="max-w-sm mx-auto mt-2">
							The full orders management interface will be displayed here.
						</p>
					</div>
				</TabsContent>

				<TabsContent
					value="products"
					className="h-[400px] flex items-center justify-center text-muted-foreground">
					<div className="text-center">
						<BoxIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
						<h3 className="text-lg font-medium">Products Management</h3>
						<p className="max-w-sm mx-auto mt-2">
							The full products management interface will be displayed here.
						</p>
					</div>
				</TabsContent>

				<TabsContent
					value="customers"
					className="h-[400px] flex items-center justify-center text-muted-foreground">
					<div className="text-center">
						<UsersIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
						<h3 className="text-lg font-medium">Customers Management</h3>
						<p className="max-w-sm mx-auto mt-2">
							The full customers management interface will be displayed here.
						</p>
					</div>
				</TabsContent>
			</Tabs>

			{/* Recent Activity & Quick Actions */}
			<div className="grid gap-4 md:grid-cols-7">
				{/* Recent Activity */}
				<Card className="md:col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex gap-3">
								<div className="relative mt-1">
									<div className="bg-primary/10 rounded-full p-1">
										<UsersIcon className="h-4 w-4 text-primary" />
									</div>
									<div className="absolute top-8 left-1/2 bottom-0 -translate-x-1/2 border-l border-dashed border-muted"></div>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium">New customer registered</p>
									<p className="text-xs text-muted-foreground">
										Rahul Sharma created an account
									</p>
									<p className="text-xs text-muted-foreground">
										15 minutes ago
									</p>
								</div>
							</div>

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
										Order #ORD-7893 for Rs 1,240
									</p>
									<p className="text-xs text-muted-foreground">
										42 minutes ago
									</p>
								</div>
							</div>

							<div className="flex gap-3">
								<div className="relative mt-1">
									<div className="bg-amber-100 rounded-full p-1">
										<AlertTriangleIcon className="h-4 w-4 text-amber-600" />
									</div>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium">Low stock alert</p>
									<p className="text-xs text-muted-foreground">
										Organic Tomatoes is running low on stock
									</p>
									<p className="text-xs text-muted-foreground">1 hour ago</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						<Button
							variant="outline"
							className="h-auto flex flex-col py-4 px-3 justify-center items-center gap-2">
							<ShoppingBagIcon className="h-5 w-5 text-primary" />
							<span className="text-xs font-normal">New Order</span>
						</Button>
						<Button
							variant="outline"
							className="h-auto flex flex-col py-4 px-3 justify-center items-center gap-2">
							<BoxIcon className="h-5 w-5 text-primary" />
							<span className="text-xs font-normal">Add Product</span>
						</Button>
						<Button
							variant="outline"
							className="h-auto flex flex-col py-4 px-3 justify-center items-center gap-2">
							<UsersIcon className="h-5 w-5 text-primary" />
							<span className="text-xs font-normal">Customers</span>
						</Button>
						<Button
							variant="outline"
							className="h-auto flex flex-col py-4 px-3 justify-center items-center gap-2">
							<CalendarIcon className="h-5 w-5 text-primary" />
							<span className="text-xs font-normal">Reports</span>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
