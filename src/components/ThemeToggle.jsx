"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	const btnClass =
		"text-foreground hover:text-primary transition-colors text-lg px-2 py-2 [&_svg]:size-5";

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				className={btnClass}
				disabled
				aria-label="Toggle theme">
				<Icon icon="mdi:theme-light-dark" className="h-6 w-6" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className={btnClass}
			onClick={toggleTheme}
			aria-label="Toggle theme">
			<Icon icon={resolvedTheme === "dark" ? "mdi:weather-sunny" : "bx:moon"} />
		</Button>
	);
}
