"use client";
import Image from "next/image";
import { useState } from "react";

// Default placeholder images for different contexts
const PLACEHOLDERS = {
	product: "/product-placeholder.svg",
	user: "/profile.jpg",
	default: "/placeholder.svg",
};

// SafeImage component with fallback placeholder support
// Props:
// - src: Image source URL
// - alt: Alt text for the image
// - type: Type of image for placeholder selection: 'product', 'user', 'default'
// - fallback: Custom fallback image URL (overrides type-based placeholder)
// - rest: Other props passed to Next.js Image component
export default function SafeImage({
	src,
	alt,
	type = "default",
	fallback,
	className,
	...rest
}) {
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Determine the placeholder to use
	const placeholder = fallback || PLACEHOLDERS[type] || PLACEHOLDERS.default;

	// Check if src is valid
	const isValidSrc = src && typeof src === "string" && src.trim() !== "";

	// Use placeholder if no valid src or if there was an error loading the image
	const imageSrc = !isValidSrc || hasError ? placeholder : src;

	return (
		<Image
			src={imageSrc}
			alt={alt || "Image"}
			className={`${className || ""} ${isLoading ? "animate-pulse bg-gray-200" : ""}`}
			onError={() => {
				setHasError(true);
				setIsLoading(false);
			}}
			onLoad={() => setIsLoading(false)}
			{...rest}
		/>
	);
}
