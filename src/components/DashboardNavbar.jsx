"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardNavbar({ toggleSidebar, collapsed }) {
	const { data: session } = useSession();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [notifications] = useState([
		{ id: 1, message: "New order received", time: "5 min ago", read: false },
		{ id: 2, message: "Product out of stock", time: "1 hour ago", read: false },
		{ id: 3, message: "New user registered", time: "3 hours ago", read: true },
	]);

	return (
		<header
			className={cn(
				"fixed top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6 transition-all duration-300",
				"right-0",
				// Responsive left positioning based on sidebar collapsed state
				collapsed ? "lg:left-16" : "lg:left-64",
			)}>
			{/* Left section with toggle, breadcrumb */}
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden"
					onClick={toggleSidebar}>
					<Icon icon="mdi:menu" className="h-5 w-5" />
				</Button>
				<div className="hidden items-center gap-1 text-sm text-gray-500 md:flex">
					<Link href="/dashboard" className="hover:text-gray-900">
						Dashboard
					</Link>
					<Icon icon="mdi:chevron-right" className="h-4 w-4" />
					<span className="text-gray-900">Overview</span>
				</div>
			</div>

			{/* Center section with search - responsive width based on sidebar */}
			<div
				className={cn(
					"mx-auto hidden md:block",
					collapsed ? "lg:max-w-md" : "lg:max-w-sm",
				)}>
				<div className="relative">
					<Icon
						icon="mdi:magnify"
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
					/>
					<Input
						type="search"
						placeholder="Search..."
						className={cn(
							"pl-9 h-9",
							collapsed
								? "md:w-[400px] lg:w-[500px]"
								: "md:w-[300px] lg:w-[400px]",
						)}
					/>
				</div>
			</div>

			{/* Right section with notifications and profile */}
			<div className="ml-auto flex items-center gap-2">
				{/* Notifications dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative h-9 w-9">
							<Icon icon="mdi:bell-outline" className="h-5 w-5" />
							<span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<DropdownMenuLabel className="font-normal">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">Notifications</p>
								<Badge variant="outline" className="ml-auto">
									{notifications.filter((n) => !n.read).length} new
								</Badge>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{notifications.map((notification) => (
							<DropdownMenuItem key={notification.id} className="p-0">
								<div
									className={cn(
										"flex w-full items-start gap-3 p-3",
										!notification.read && "bg-muted/50",
									)}>
									<div
										className={cn(
											"mt-1 flex h-8 w-8 items-center justify-center rounded-full",
											notification.read ? "bg-gray-100" : "bg-primary/10",
										)}>
										<Icon
											icon="mdi:bell-outline"
											className={cn(
												"h-4 w-4",
												notification.read ? "text-gray-500" : "text-primary",
											)}
										/>
									</div>
									<div className="flex-1">
										<p className="text-sm">{notification.message}</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{notification.time}
										</p>
									</div>
									{!notification.read && (
										<div className="flex h-2 w-2 items-center">
											<span className="h-2 w-2 rounded-full bg-primary"></span>
										</div>
									)}
								</div>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="justify-center text-center font-medium">
							View all notifications
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<Icon icon="mdi:dots-vertical" className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuItem className="flex items-center gap-2">
							<Icon icon="mdi:help-circle-outline" className="h-4 w-4" />
							<span>Help</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex items-center gap-2">
							<Icon icon="mdi:settings-outline" className="h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="relative h-8 overflow-hidden rounded-full ">
							<UserAvatar src={session.user.profilePic} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">{session?.user?.name}</p>
								<p className="text-xs text-gray-500">{session?.user?.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								href="/dashboard/profile"
								className="flex items-center gap-2">
								<Icon icon="mdi:account-outline" className="h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href="/dashboard/settings"
								className="flex items-center gap-2">
								<Icon icon="mdi:cog-outline" className="h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
							onClick={() => signOut({ callbackUrl: "/" })}>
							<Icon icon="mdi:logout" className="h-4 w-4" />
							<span>Logout</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Mobile menu button */}
				<Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="sm" className="md:hidden">
							<Icon icon="mdi:dots-vertical" className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="top" className="w-full pt-14">
						<div className="relative mb-4">
							<Icon
								icon="mdi:magnify"
								className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
							/>
							<Input type="search" placeholder="Search..." className="pl-9" />
						</div>
						<div className="grid grid-cols-3 gap-2">
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20">
								<Icon
									icon="mdi:view-dashboard-outline"
									className="h-6 w-6 mb-1"
								/>
								<span className="text-xs">Dashboard</span>
							</Button>
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20">
								<Icon icon="mdi:bell-outline" className="h-6 w-6 mb-1" />
								<span className="text-xs">Notifications</span>
							</Button>
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20">
								<Icon icon="mdi:cog-outline" className="h-6 w-6 mb-1" />
								<span className="text-xs">Settings</span>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
