"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import { updateQuantity, removeFromCart } from "../actions/cart";
import { useCart } from "../context/CartContext";

export default function CartProduct({ product, onRemove }) {
	const [quantity, setQuantity] = useState(product.quantity);
	const { setCartItemCount } = useCart();
	const [loading, setLoading] = useState({ delete: false });

	const handleIncrease = async () => {
		setQuantity(quantity + 1);
		if (
			!(await updateQuantity({
				_id: product._id,
				quantity: quantity + 1,
			}))
		)
			setQuantity(quantity);
		setCartItemCount((prev) => prev + 1);
	};

	const handleDecrease = async () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
			if (
				!(await updateQuantity({
					_id: product._id,
					quantity: quantity - 1,
				}))
			)
				setQuantity(quantity);
			setCartItemCount((prev) => prev - 1);
		}
	};

	const handleRemove = async () => {
		setLoading({ delete: true });
		if (await removeFromCart(product._id)) {
			setCartItemCount((prev) => prev - quantity);
			onRemove(product._id); // Call the onRemove function passed from the parent component
		}
		setLoading({ delete: false });
	};

	return (
		<div className="flex w-full justify-between items-center border-b border-gray-200 pb-4">
			<div className="flex gap-2 items-center">
				<Image
					src={product.image}
					alt={product.name}
					width={150}
					height={150}
					className="aspect-video object-cover"
				/>
				<p className="font-bold text-lg">{product.name}</p>
			</div>
			<p>{product.price}</p>
			<div className="flex gap-4 items-center">
				<Button variant="outline" onClick={handleDecrease}>
					-
				</Button>
				<span>{quantity}</span>
				<Button variant="outline" onClick={handleIncrease}>
					+
				</Button>
			</div>
			<p>Rs. {product.price * quantity}</p>
			<Button
				variant="destructive"
				size="icon"
				onClick={handleRemove}
				isLoading={loading.delete}>
				<Icon
					icon="icon-park-solid:delete-four"
					width="1.2rem"
					height="1.2rem"
				/>
			</Button>
		</div>
	);
}
