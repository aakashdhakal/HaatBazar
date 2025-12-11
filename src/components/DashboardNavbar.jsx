"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUser } from "@/app/(server)/actions/users";

export default function DashboardNavbar({ toggleSidebar, collapsed }) {
	const { data: session, status } = useSession();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [user, setUser] = useState(null);

	// Fetch the database user
	useEffect(() => {
		const fetchUser = async () => {
			if (status === "authenticated") {
				const userData = await getCurrentUser();
				if (userData) {
					setUser(userData);
				}
			}
		};
		fetchUser();
	}, [status]);

	return (
		<header
			className={cn(
				"fixed top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6 transition-all duration-300",
				"right-0",
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
				<div className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
					<Link href="/dashboard" className="hover:text-foreground">
						Dashboard
					</Link>
					<Icon icon="mdi:chevron-right" className="h-4 w-4" />
					<span className="text-foreground">Overview</span>
				</div>
			</div>

			{/* Center section with search */}
			<div
				className={cn(
					"mx-auto hidden md:block",
					collapsed ? "lg:max-w-md" : "lg:max-w-sm",
				)}>
				<div className="relative">
					<Icon
						icon="mdi:magnify"
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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

			{/* Right section with theme toggle and profile */}
			<div className="ml-auto flex items-center gap-2">
				{/* Theme Toggle */}
				<ThemeToggle />

				{/* Quick Actions */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<Icon icon="mdi:dots-vertical" className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuItem asChild>
							<Link href="/" className="flex items-center gap-2">
								<Icon icon="mdi:home-outline" className="h-4 w-4" />
								<span>Go to Store</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href="/dashboard/settings"
								className="flex items-center gap-2">
								<Icon icon="mdi:settings-outline" className="h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* User Profile */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="relative h-8 overflow-hidden rounded-full">
							<UserAvatar src={user?.image} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">{user?.name}</p>
								<p className="text-xs text-muted-foreground">{user?.email}</p>
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
							className="flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
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
								className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input type="search" placeholder="Search..." className="pl-9" />
						</div>
						<div className="grid grid-cols-3 gap-2">
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20"
								asChild>
								<Link href="/dashboard">
									<Icon
										icon="mdi:view-dashboard-outline"
										className="h-6 w-6 mb-1"
									/>
									<span className="text-xs">Dashboard</span>
								</Link>
							</Button>
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20"
								asChild>
								<Link href="/">
									<Icon icon="mdi:home-outline" className="h-6 w-6 mb-1" />
									<span className="text-xs">Store</span>
								</Link>
							</Button>
							<Button
								variant="ghost"
								className="flex flex-col items-center justify-center h-20"
								asChild>
								<Link href="/dashboard/settings">
									<Icon icon="mdi:cog-outline" className="h-6 w-6 mb-1" />
									<span className="text-xs">Settings</span>
								</Link>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
