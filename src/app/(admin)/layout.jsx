"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSideBar";
import DashboardNavbar from "@/components/DashboardNavbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Check for stored preference
		const storedPreference = localStorage.getItem("sidebarCollapsed");
		if (storedPreference !== null) {
			setSidebarCollapsed(storedPreference === "true");
		}

		setMounted(true);

		// Check authentication
		if (status === "unauthenticated") {
			router.push("/login?callbackUrl=/dashboard");
		}
	}, [router, status]);

	// Store preference when changed
	useEffect(() => {
		if (mounted) {
			localStorage.setItem("sidebarCollapsed", sidebarCollapsed);
		}
	}, [sidebarCollapsed, mounted]);

	// Toggle sidebar state
	const toggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	// Show loading state while checking authentication
	if (!mounted || status === "loading") {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-50">
				<div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
			</div>
		);
	}

	// Redirect if not authenticated
	if (status === "unauthenticated") {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardSidebar
				collapsed={sidebarCollapsed}
				setCollapsed={setSidebarCollapsed}
			/>
			<DashboardNavbar
				toggleSidebar={toggleSidebar}
				collapsed={sidebarCollapsed}
			/>
			<main
				className={cn(
					"pt-16 min-h-screen transition-all duration-300",
					sidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
				)}>
				<div className="p-4 md:p-6 lg:p-8">{children}</div>
			</main>
		</div>
	);
}
