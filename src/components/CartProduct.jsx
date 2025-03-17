"use client";
import Image from "next/image";
import { useState } from "react";
import { updateQuantity, removeFromCart, getCart } from "@/app/actions/cart";
import { useCart } from "@/context/CartContext";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CartProduct({ product, onRemove }) {
	const { setCartItems } = useCart({});
	const [loading, setLoading] = useState(false);
	const [quantity, setQuantity] = useState(product.quantity);
	const { success, error } = useToast();

	// Handle quantity input change
	const handleQuantityInput = (e) => {
		const value = parseInt(e.target.value);
		if (isNaN(value) || value < 1) return;
		handleQuantityChange(value);
	};

	// Handle quantity button clicks
	const handleQuantityChange = async (newQuantity) => {
		if (newQuantity < 1) return;
		setLoading(true);
		setQuantity(newQuantity);

		try {
			await updateQuantity({ productId: product._id, quantity: newQuantity });
			setCartItems(await getCart());
		} catch (err) {
			error({
				title: "Error updating cart",
				description: "Please try again",
			});
			console.error("Error updating quantity:", err);
			// Revert to previous quantity on error
			setQuantity(quantity);
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async () => {
		setLoading(true);
		try {
			await removeFromCart({ productId: product._id });
			onRemove(product._id);
			success({
				title: "Item removed",
				description: `${product.name} removed from cart`,
			});
		} catch (err) {
			error({
				title: "Error removing item",
				description: "Please try again",
			});
			console.error("Error removing item:", err);
		} finally {
			setLoading(false);
		}
	};

	// Calculate discount percentage if original price exists
	const discountPercentage = product.originalPrice
		? Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
		  )
		: 0;

	const isDiscounted = discountPercentage > 0;

	return (
		<div className="flex flex-col sm:flex-row items-center p-4 hover:bg-gray-50/50 justify-between gap-8">
			{/* Product (col-span-4) - Image and details */}
			<div className="flex items-center w-4/12">
				{/* Product Image */}
				<div className="w-16 h-16 flex-shrink-0 mr-3">
					<Link href={`/product/${product._id}`}>
						<AspectRatio
							ratio={1}
							className="bg-gray-50 rounded-md overflow-hidden">
							<Image
								src={product.image || "/product-placeholder.jpg"}
								alt={product.name}
								fill
								className="object-cover"
								sizes="64px"
							/>
							{isDiscounted && (
								<Badge
									variant="secondary"
									className="absolute top-0 left-0 text-[10px] px-1 py-0">
									-{discountPercentage}%
								</Badge>
							)}
						</AspectRatio>
					</Link>
				</div>

				{/* Product Details */}
				<div className="flex-1 min-w-0">
					<Link href={`/product/${product._id}`} className="group">
						<h3 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
							{product.name}
						</h3>
					</Link>
				</div>
			</div>

			{/* Price (col-span-2) */}
			<div className="text-center">
				<span className="text-gray-900">Rs {product.price}</span>
				{isDiscounted && (
					<div className="text-gray-400 text-xs line-through">
						Rs {product.originalPrice}
					</div>
				)}
			</div>

			{/* Quantity (col-span-2) */}
			<div className="flex justify-center w-full sm:w-2/12 ">
				<div className="flex items-center border border-gray-200 rounded">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-full rounded-r-none border-r border-gray-200"
						onClick={() => handleQuantityChange(quantity - 1)}
						disabled={quantity <= 1 || loading}>
						<Icon icon="mdi:minus" className="h-3 w-3" />
						<span className="sr-only">Decrease quantity</span>
					</Button>

					<Input
						type="number"
						min="1"
						value={quantity}
						onChange={handleQuantityInput}
						disabled={loading}
						className="rounded-none text-center border-x-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					/>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-full rounded-l-none border-l border-gray-200"
						onClick={() => handleQuantityChange(quantity + 1)}
						disabled={loading}>
						<Icon icon="mdi:plus" className="h-3 w-3" />
						<span className="sr-only">Increase quantity</span>
					</Button>
				</div>
			</div>

			{/* Total (col-span-2) */}
			<div className="text-center w-max sm:w-2/12 mt-2 sm:mt-0">
				<span className="font-medium text-gray-900">
					Rs {product.price * quantity}
				</span>
			</div>

			{/* Action (col-span-2) */}
			<div className="flex w-min items-centerbg-slate-600 justify-center">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRemove}
								disabled={loading}
								className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50">
								{loading ? (
									<div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
								) : (
									<Icon icon="mdi:trash-outline" className="h-4 w-4" />
								)}
								<span className="sr-only">Remove item</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Remove from cart</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
