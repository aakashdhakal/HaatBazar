"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { useToast } from "../hooks/use-toast";
import { useState } from "react";
import { addToCart } from "../actions/cart";
import { addToWishList } from "../actions/wishList";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

export default function ProductCard({ product }) {
	const [loading, setLoading] = useState({ cart: false, wishlist: false });
	const { setCartItemCount } = useCart();
	const { setWishListItemsCount } = useWishList();
	const { toast } = useToast();

	const handleCartClick = async () => {
		setLoading((prev) => ({ ...prev, cart: true }));
		const data = await addToCart({ _id: product._id, quantity: 1 });
		setCartItemCount(data.noOfItems);
		toast({
			title: product.name + " added to the cart",
		});
		setLoading((prev) => ({ ...prev, cart: false }));
	};

	const handleWishListClick = async () => {
		setLoading((prev) => ({ ...prev, wishlist: true }));
		const data = await addToWishList({ _id: product._id });
		setWishListItemsCount(data.noOfItems);
		toast({
			title: product.name + " added to the wishlist",
		});
		setLoading((prev) => ({ ...prev, wishlist: false }));
	};

	return (
		<div
			className="flex flex-col items-center gap-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow
      duration-300 w-60 h-80">
			<div className="w-40 h-40 relative">
				<Image
					src={product.image}
					alt={product.name}
					fill="responsive"
					className="rounded-lg object-cover"
					priority={true}
					sizes="100%"
				/>
			</div>
			<h2 className="text-l font-semibold text-gray-800">{product.name}</h2>
			<p className="text-l text-gray-600">Rs {product.price}</p>
			<div className="flex gap-4">
				<Button
					variant="default"
					onClick={handleCartClick}
					isLoading={loading.cart}
					loadingtext="Adding ">
					Add to Cart
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={handleWishListClick}
					isLoading={loading.wishlist}>
					<Icon icon="solar:heart-linear" width="2rem" height="2rem" />
				</Button>
			</div>
		</div>
	);
}
