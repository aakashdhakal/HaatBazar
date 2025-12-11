"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
	variant = "ghost",
	size = "icon",
	className = "",
}) {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) {
		return (
			<Button variant={variant} size={size} className={className} disabled>
				<Icon icon="mdi:theme-light-dark" className="h-5 w-5" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={toggleTheme}
			aria-label="Toggle theme">
			<Icon
				icon={
					resolvedTheme === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"
				}
				className="h-5 w-5"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
