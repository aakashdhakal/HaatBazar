"use client";

import { Icon } from "@iconify-icon/react";
import { useState } from "react";

export default function PrimaryButton(props) {
	// const [loading, setLoading] = useState(false);

	// function handleClick() {
	// 	setLoading(true);
	// 	props.onClick();
	// }

	return (
		<button
			onClick={props.onClick}
			className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
			{props.text}
		</button>
	);
}

export function SecondaryButton({ text, onClick }) {
	return (
		<button
			onClick={onClick}
			className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600">
			{text}
		</button>
	);
}
export function AddToFavouritesButton(props) {
	return (
		<button
			className="bg-background text-foreground p-1 rounded-lg border-primary border-2 hover:bg-accent flex items-center"
			onClick={props.onclick}>
			<Icon icon="iconamoon:heart-light" width="1.6rem" height="100%" />
		</button>
	);
}
