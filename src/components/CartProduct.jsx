"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { updateQuantity, removeFromCart } from "@/app/(server)/actions/cart";
import { getCart } from "@/app/(server)/actions/cart";
import { useCart } from "@/context/CartContext";

export default function CartProduct({ product, onRemove }) {
	const { setCartItems } = useCart({});
	const [loading, setLoading] = useState(false);
	const [quantity, setQuantity] = useState(product.quantity);

	const handleQuantityChange = async (newQuantity) => {
		if (newQuantity < 1) return;
		setLoading(true);
		setQuantity(newQuantity);

		try {
			await updateQuantity({ productId: product._id, quantity: newQuantity });
			setCartItems(await getCart());
		} catch (error) {
			console.error("Error updating quantity:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async () => {
		setLoading(true);
		try {
			await removeFromCart({ productId: product._id });
			onRemove(product._id);
		} catch (error) {
			console.error("Error removing item:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<div className="grid grid-cols-12 gap-2 items-center">
				{/* Product Image & Info */}
				<div className="col-span-6 md:col-span-6">
					<div className="flex items-center gap-3">
						<div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
							<Image
								src={product.image}
								alt={product.name}
								fill
								sizes="64px"
								className="object-cover"
							/>
						</div>

						<div className="flex-grow min-w-0">
							<h3 className="text-sm font-medium text-gray-900 line-clamp-1">
								{product.name}
							</h3>
							<p className="text-xs text-gray-500">
								{product.weight || product.quantity || "500g"}
							</p>
							<span className="text-xs text-gray-500 md:hidden">
								Rs {product.price}
							</span>
						</div>
					</div>
				</div>

				{/* Price - Desktop only */}
				<div className="col-span-2 text-center hidden md:block">
					<span className="text-sm font-medium">Rs {product.price}</span>
				</div>

				{/* Quantity and Actions - All in one line */}
				<div className="col-span-6 md:col-span-4 flex items-center justify-end gap-3">
					{/* Quantity controls */}
					<div className="flex items-center border border-gray-200 rounded-md">
						<button
							onClick={() => handleQuantityChange(quantity - 1)}
							disabled={quantity <= 1 || loading}
							className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300"
							aria-label="Decrease quantity">
							<Icon icon="mdi:minus" className="w-4 h-4" />
						</button>

						<span className="w-8 text-center text-sm">{quantity}</span>

						<button
							onClick={() => handleQuantityChange(quantity + 1)}
							disabled={loading}
							className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700"
							aria-label="Increase quantity">
							<Icon icon="mdi:plus" className="w-4 h-4" />
						</button>
					</div>

					{/* Total price */}
					<div className="text-right min-w-[60px]">
						<span className="text-sm font-medium">
							Rs {(product.price * quantity).toFixed(2)}
						</span>
					</div>

					{/* Remove button - Always visible */}
					<Button
						variant="ghost"
						size="sm"
						onClick={handleRemove}
						disabled={loading}
						aria-label="Remove item"
						className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50">
						{loading ? (
							<div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
						) : (
							<Icon icon="mdi:trash-outline" className="w-4 h-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
