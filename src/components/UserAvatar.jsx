"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

export default function UserAvatar({ src, size, ...rest }) {
	const [hasError, setHasError] = useState(false);

	return (
		<Avatar {...rest}>
			{!hasError && (
				<AvatarImage
					src={src}
					alt="User Avatar"
					onError={() => setHasError(true)}
				/>
			)}
			{hasError && (
				<AvatarFallback>
					<Image
						src="/profile.jpg"
						alt="User Avatar"
						width={size || 40}
						height={size || 40}
						className="rounded-full"
					/>
				</AvatarFallback>
			)}
		</Avatar>
	);
}
