"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Loading() {
	const [loadingText, setLoadingText] = useState("Loading");

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingText((current) => {
				if (current === "Loading...") return "Loading";
				return current + ".";
			});
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
			<div className="relative">
				{/* Spinning circle */}
				<div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>

				{/* Animated spinner overlays */}
				<div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-primary rounded-full animate-spin"></div>
				<div
					className="absolute top-0 left-0 w-20 h-20 border-b-4 border-secondary rounded-full animate-spin"
					style={{ animationDuration: "1.5s" }}></div>

				{/* Center icon */}
				<div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
					<Icon
						icon="mdi:shopping-outline"
						className="text-primary w-8 h-8 animate-pulse"
					/>
				</div>
			</div>

			<div className="mt-6 text-center">
				<h3 className="text-lg font-semibold text-primary mb-1">HAATBAZAR</h3>
				<p className="text-gray-600 min-w-[5.5rem] text-center">
					{loadingText}
				</p>
			</div>
		</div>
	);
}
