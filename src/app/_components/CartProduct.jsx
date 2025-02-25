"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import { updateQuantity, removeFromCart } from "../actions/cart";
import { useCart } from "../context/CartContext";
import { Checkbox } from "./ui/checkbox";

export default function CartProduct({ product, onRemove }) {
	const [quantity, setQuantity] = useState(product.quantity);
	// Remove unused cartItems variable
	const { setCartItems } = useCart({});
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
		else
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === product._id ? { ...item, quantity: quantity + 1 } : item,
				),
			);
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
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === product._id ? { ...item, quantity: quantity - 1 } : item,
				),
			);
		}
	};

	const handleRemove = async () => {
		setLoading({ delete: true });
		if (await removeFromCart(product._id)) {
			setCartItems((prev) => prev.filter((item) => item._id !== product._id));
			onRemove(product._id); // Call the onRemove function passed from the parent component
		}
		setLoading({ delete: false });
	};

	return (
		<div className="flex w-full gap-4 items-center justify-between border-b border-gray-200 p-4">
			<div className="flex gap-4 items-center w-[25%] ">
				<Checkbox />
				<Image
					src={product.image}
					alt={product.name}
					width={70}
					height={70}
					className="aspect-square object-cover"
					priority={true}
				/>
				<p className="font-bold text-base">{product.name}</p>
			</div>
			<p className="w-[10%]  text-center">Rs. {product.price}</p>
			<div className="w-[30%] flex gap-4 items-center justify-center ">
				<Button variant="outline" onClick={handleDecrease}>
					-
				</Button>
				<span className="w-5 text-center">{quantity}</span>
				<Button variant="outline" onClick={handleIncrease}>
					+
				</Button>
			</div>
			<p className="w-[20%]  text-center">Rs. {product.price * quantity}</p>
			<div className="w-[10%]  flex items-center justify-center">
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
		</div>
	);
}
