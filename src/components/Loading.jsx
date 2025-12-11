"use client";
import { Icon } from "@iconify/react";

export default function LoadingComponent({ loadingText, loadingIcon }) {
	return (
		<div className="inset-0 bg-background bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-50">
			<Icon icon={loadingIcon} className="text-primary w-8 h-8 animate-pulse" />
			<div className="relative flex items-center justify-center">
				{/* Spinning circle */}
				<div className="flex items-center justify-center w-20 h-20">
					<div className="w-full h-full border-4 border-muted rounded-full"></div>
					<div className="absolute w-full h-full border-t-4 border-primary rounded-full animate-spin"></div>
					<div
						className="absolute w-full h-full border-b-4 border-secondary rounded-full animate-spin"
						style={{ animationDuration: "1.5s" }}></div>
					<div className="absolute flex items-center justify-center w-full h-full">
						<Icon
							icon={loadingIcon}
							className="text-primary w-8 h-8 animate-pulse"
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center gap-1">
				<h3 className="text-lg font-semibold text-primary">HAATBAZAR</h3>
				<p className="text-muted-foreground min-w-[5.5rem]">{loadingText}</p>
			</div>
		</div>
	);
}
