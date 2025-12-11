import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "@/lib/utils";
import {
	CalendarIcon,
	MailIcon,
	UserIcon,
	ShieldIcon,
	MapPinIcon,
	PhoneIcon,
	PencilIcon,
} from "lucide-react";

// Database interactions
import { getCurrentUser } from "@/app/(server)/actions/users";
import dbConnect from "@/lib/db";
import User from "@/modals/userModal";

async function getFullUserProfile(email) {
	try {
		await dbConnect();
		const user = await User.findOne({ email }).lean();

		if (!user) return null;

		return {
			...user,
			_id: user._id.toString(),
			createdAt: user.createdAt ? user.createdAt.toISOString() : null,
			updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
			dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
		};
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export default async function ProfilePage() {
	const session = await auth();

	if (!session?.user?.email) {
		redirect("/login");
	}

	const user = await getFullUserProfile(session.user.email);

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
					<p className="text-muted-foreground">
						Manage your account information and settings
					</p>
				</div>
				<Link href="/dashboard/settings">
					<Button>
						<PencilIcon className="h-4 w-4 mr-2" />
						Edit Profile
					</Button>
				</Link>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Profile Card */}
				<Card className="md:col-span-1">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center">
							<div className="relative mb-4">
								<UserAvatar
									src={user.image}
									className="h-24 w-24 border-4 border-background shadow-lg"
								/>
								<Badge
									className="absolute -bottom-2 left-1/2 -translate-x-1/2"
									variant={user.role === "admin" ? "default" : "secondary"}>
									{user.role === "admin" ? "Admin" : "Customer"}
								</Badge>
							</div>
							<h2 className="text-xl font-semibold mt-4">{user.name}</h2>
							<p className="text-sm text-muted-foreground">{user.email}</p>

							{user.createdAt && (
								<p className="text-xs text-muted-foreground mt-2">
									Member since {formatDate(user.createdAt)}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Personal Information */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							Personal Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Full Name</p>
								<p className="font-medium">{user.name || "Not set"}</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Email</p>
								<div className="flex items-center gap-2">
									<MailIcon className="h-4 w-4 text-muted-foreground" />
									<p className="font-medium">{user.email}</p>
								</div>
							</div>
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Phone</p>
								<div className="flex items-center gap-2">
									<PhoneIcon className="h-4 w-4 text-muted-foreground" />
									<p className="font-medium">{user.phoneNumber || "Not set"}</p>
								</div>
							</div>
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Date of Birth</p>
								<div className="flex items-center gap-2">
									<CalendarIcon className="h-4 w-4 text-muted-foreground" />
									<p className="font-medium">
										{user.dateOfBirth
											? formatDate(user.dateOfBirth)
											: "Not set"}
									</p>
								</div>
							</div>
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Gender</p>
								<p className="font-medium capitalize">
									{user.gender || "Not set"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm text-muted-foreground">Account Type</p>
								<div className="flex items-center gap-2">
									<ShieldIcon className="h-4 w-4 text-muted-foreground" />
									<p className="font-medium capitalize">{user.role}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Shipping Address */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MapPinIcon className="h-5 w-5" />
							Addresses
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6 md:grid-cols-2">
							{/* Shipping Address */}
							<div className="space-y-3">
								<h3 className="font-medium">Shipping Address</h3>
								{user.shippingAddress && user.shippingAddress.length > 0 ? (
									<div className="p-4 rounded-lg bg-muted/50 space-y-1">
										{user.shippingAddress.map((addr, index) => (
											<div key={index}>
												<p className="text-sm">
													{addr.street}, {addr.city}
												</p>
												<p className="text-sm">
													{addr.district}, {addr.province}
												</p>
												<p className="text-sm text-muted-foreground">
													ZIP: {addr.ZIP}
												</p>
												{index < user.shippingAddress.length - 1 && (
													<Separator className="my-2" />
												)}
											</div>
										))}
									</div>
								) : (
									<div className="p-4 rounded-lg border border-dashed text-center">
										<p className="text-sm text-muted-foreground">
											No shipping address set
										</p>
									</div>
								)}
							</div>

							{/* Billing Address */}
							<div className="space-y-3">
								<h3 className="font-medium">Billing Address</h3>
								{user.billingAddress && user.billingAddress.length > 0 ? (
									<div className="p-4 rounded-lg bg-muted/50 space-y-1">
										{user.billingAddress.map((addr, index) => (
											<div key={index}>
												<p className="text-sm">
													{addr.street}, {addr.city}
												</p>
												<p className="text-sm">
													{addr.district}, {addr.province}
												</p>
												<p className="text-sm text-muted-foreground">
													ZIP: {addr.ZIP}
												</p>
												{index < user.billingAddress.length - 1 && (
													<Separator className="my-2" />
												)}
											</div>
										))}
									</div>
								) : (
									<div className="p-4 rounded-lg border border-dashed text-center">
										<p className="text-sm text-muted-foreground">
											No billing address set
										</p>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
