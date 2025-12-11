import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { UsersIcon, UserPlusIcon, ShieldCheckIcon } from "lucide-react";
import InfoCard from "@/components/dashboard/InfoCard";

// Database interactions
import { getAllUsers } from "@/app/(server)/actions/users";
import dbConnect from "@/lib/db";
import User from "@/modals/userModal";

async function getCustomersData() {
	try {
		await dbConnect();

		// Get all users with full details
		const users = await User.find({})
			.select("name email image role createdAt")
			.sort({ createdAt: -1 })
			.lean();

		// Calculate stats
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const thisMonth = new Date();
		thisMonth.setDate(1);
		thisMonth.setHours(0, 0, 0, 0);

		const totalCustomers = users.length;
		const adminCount = users.filter((u) => u.role === "admin").length;
		const newThisMonth = users.filter((u) => {
			if (!u.createdAt) return false;
			return new Date(u.createdAt) >= thisMonth;
		}).length;

		return {
			users: users.map((user) => ({
				...user,
				_id: user._id.toString(),
				createdAt: user.createdAt ? user.createdAt.toISOString() : null,
			})),
			stats: {
				totalCustomers,
				adminCount,
				newThisMonth,
			},
		};
	} catch (error) {
		console.error("Error fetching customers data:", error);
		return {
			users: [],
			stats: {
				totalCustomers: 0,
				adminCount: 0,
				newThisMonth: 0,
			},
		};
	}
}

export default async function CustomersPage() {
	const session = await auth();

	// Only allow admins
	if (session?.user?.role !== "admin") {
		redirect("/dashboard");
	}

	const { users, stats } = await getCustomersData();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Customers</h1>
				<p className="text-muted-foreground">
					Manage and view all registered customers
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<InfoCard
					title="Total Customers"
					value={stats.totalCustomers}
					icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
				/>
				<InfoCard
					title="New This Month"
					value={stats.newThisMonth}
					icon={<UserPlusIcon className="h-4 w-4 text-muted-foreground" />}
				/>
				<InfoCard
					title="Admin Users"
					value={stats.adminCount}
					icon={<ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />}
				/>
			</div>

			{/* Customers Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Customers</CardTitle>
					<CardDescription>
						A list of all registered users on the platform
					</CardDescription>
				</CardHeader>
				<CardContent>
					{users.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium">No customers yet</h3>
							<p className="text-sm text-muted-foreground">
								Customers will appear here once they register
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Joined</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user._id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage src={user.image} alt={user.name} />
													<AvatarFallback>
														{user.name?.charAt(0)?.toUpperCase() || "U"}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium">{user.name}</span>
											</div>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{user.email}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													user.role === "admin" ? "default" : "secondary"
												}>
												{user.role}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{user.createdAt ? formatDate(user.createdAt) : "N/A"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
