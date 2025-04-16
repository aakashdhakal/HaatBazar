"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import { getCurrentUser } from "@/app/(server)/actions/users";

export default function DashboardSidebar({ collapsed, setCollapsed }) {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);
	const [user, setUser] = useState(null);

	// Add this effect to fetch the database user
	useEffect(() => {
		const fetchUser = async () => {
			if (status === "authenticated") {
				const userData = await getCurrentUser();
				console.log("User data:", userData);
				if (userData) {
					setUser(userData);
				}
			}
		};
		fetchUser();
	}, [status]);

	// Fix hydration issues
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isAdmin = session?.user?.role === "admin";

	const navItems = [
		{
			title: "Dashboard",
			href: "/dashboard",
			icon: "mdi:view-dashboard-outline",
			active: pathname === "/dashboard",
		},
		{
			title: "Orders",
			href: "/dashboard/orders",
			icon: "mdi:package-variant-closed",
			active: pathname.startsWith("/dashboard/orders"),
			badge: isAdmin ? "12" : undefined,
		},
		...(isAdmin
			? [
					{
						title: "Products",
						href: "/dashboard/products",
						icon: "mdi:shopping-outline",
						active: pathname.startsWith("/dashboard/products"),
						badge: "23",
					},
					{
						title: "Categories",
						href: "/dashboard/categories",
						icon: "mdi:tag-multiple-outline",
						active: pathname.startsWith("/dashboard/categories"),
					},
					{
						title: "Customers",
						href: "/dashboard/customers",
						icon: "mdi:account-group-outline",
						active: pathname.startsWith("/dashboard/customers"),
					},
					{
						title: "Analytics",
						href: "/dashboard/analytics",
						icon: "mdi:chart-bar",
						active: pathname.startsWith("/dashboard/analytics"),
					},
			  ]
			: [
					{
						title: "Wishlist",
						href: "/dashboard/wishlist",
						icon: "mdi:heart-outline",
						active: pathname.startsWith("/dashboard/wishlist"),
						badge: "7",
					},
					{
						title: "Reviews",
						href: "/dashboard/reviews",
						icon: "mdi:star-outline",
						active: pathname.startsWith("/dashboard/reviews"),
					},
			  ]),
		{
			title: "Profile",
			href: "/dashboard/profile",
			icon: "mdi:account-outline",
			active: pathname.startsWith("/dashboard/profile"),
		},
		{
			title: "Settings",
			href: "/dashboard/settings",
			icon: "mdi:cog-outline",
			active: pathname.startsWith("/dashboard/settings"),
		},
	];

	return (
		<div
			className={cn(
				"fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-white transition-all duration-300",
				collapsed ? "w-16" : "w-64",
			)}>
			{/* Logo area */}
			<div className="flex h-16 items-center justify-between border-b px-3 py-4">
				<Link
					href="/"
					className="flex items-center justify-center gap-2 w-full">
					{!collapsed ? (
						<Image
							src="/logoSideText.png"
							width={130}
							height={125}
							alt="HAATBAZAR"
							className="h-11 w-auto"
						/>
					) : (
						<Image
							src="/HaatBazar.png"
							width={150}
							height={150}
							alt="HAATBAZAR"
						/>
					)}
				</Link>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 rounded-full"
					onClick={() => setCollapsed(!collapsed)}>
					<Icon
						icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
						className="h-5 w-5"
					/>
				</Button>
			</div>

			{/* Navigation links */}
			<ScrollArea className="flex-1 overflow-hidden hover:overflow-auto">
				<div className="px-3 py-4">
					{!collapsed && (
						<div className="mb-4 px-3">
							<h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
								{isAdmin ? "Admin Dashboard" : "Dashboard"}
							</h2>
						</div>
					)}
					<nav className="flex flex-col gap-1">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
									item.active
										? "bg-primary/10 text-primary"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
									collapsed && "justify-center px-2",
								)}>
								<Icon
									icon={item.icon}
									className={cn(
										"h-5 w-5",
										item.active ? "text-primary" : "text-gray-500",
									)}
								/>
								{!collapsed && <span>{item.title}</span>}

								{!collapsed && item.badge && (
									<Badge
										variant="outline"
										className={cn(
											"ml-auto h-5 min-w-[1.25rem] px-1 text-center text-xs",
											item.active && "border-primary/50 text-primary",
										)}>
										{item.badge}
									</Badge>
								)}
								{/* {collapsed && item.badge && (
									<Badge
										variant="outline"
										className="absolute right-1 top-1 h-4 min-w-[1rem] px-1 text-center text-xs">
										{item.badge}
									</Badge>
								)} */}
							</Link>
						))}
					</nav>
				</div>
			</ScrollArea>

			{/* User profile section */}
			<div className="border-t p-3">
				<div
					className={cn(
						"flex items-center gap-3 rounded-md bg-gray-50 p-3",
						collapsed && "justify-center p-2",
					)}>
					<UserAvatar src={user?.image} />
					{!collapsed && (
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">{user?.name}</p>
							<p className="truncate text-xs text-gray-500">{user?.email}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
