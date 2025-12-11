"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

export function Rating({ value = 0, onChange, max = 5, readOnly = false }) {
	const [hoverValue, setHoverValue] = useState(0);

	return (
		<div className="flex items-center">
			{[...Array(max)].map((_, index) => {
				const ratingValue = index + 1;
				return (
					<button
						type="button"
						key={index}
						className={`text-2xl ${
							readOnly ? "cursor-default" : "cursor-pointer"
						}`}
						onClick={() => !readOnly && onChange(ratingValue)}
						onMouseEnter={() => !readOnly && setHoverValue(ratingValue)}
						onMouseLeave={() => !readOnly && setHoverValue(0)}
						disabled={readOnly}>
						<Icon
							icon={
								ratingValue <= (hoverValue || value)
									? "mdi:star"
									: "mdi:star-outline"
							}
							className={`w-6 h-6 ${
								ratingValue <= (hoverValue || value)
									? "text-amber-400"
									: "text-muted"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}
