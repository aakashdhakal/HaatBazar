"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { addToCart, getCart } from "@/app/(server)/actions/cart";
import { addToWishList } from "@/app/(server)/actions/wishList";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProductCard({ product }) {
	const [loading, setLoading] = useState({ cart: false, wishlist: false });
	const { setCartItems } = useCart({});
	const { setWishListItemsCount } = useWishList();
	const { success, error } = useToast();
	const { data: session } = useSession();

	// const discountPercentage = product.originalPrice
	// 	? Math.round(
	// 			((product.originalPrice - product.price) / product.originalPrice) * 100,
	// 	  )
	// 	: 0;

	const discountPercentage = 10;

	const handleCartClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		setLoading((prev) => ({ ...prev, cart: true }));
		if (session) {
			await addToCart({ _id: product._id, quantity: 1 });
			success({
				title: product.name + " added to the cart",
			});
			setCartItems(await getCart());
		} else {
			error({ title: "Please login to add items to the cart" });
		}
		setLoading((prev) => ({ ...prev, cart: false }));
	};

	const handleWishListClick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		setLoading((prev) => ({ ...prev, wishlist: true }));
		if (session) {
			const data = await addToWishList({ _id: product._id });
			success({
				title: product.name + " added to the cart",
			});
			setWishListItemsCount(data.noOfItems);
		} else {
			error({ title: "Please login to add items to the cart" });
		}
		setLoading((prev) => ({ ...prev, wishlist: false }));
	};

	return (
		<Link href={`/product/${product._id}`} className="block">
			<div className="bg-white rounded-md overflow-hidden group relative border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col h-full w-[15vw]">
				{/* Image container with badge and wishlist */}
				<div className="relative overflow-hidden bg-gray-50 w-full h-40 flex-shrink-0">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 200px"
					/>

					{/* Discount badge */}
					{discountPercentage > 0 && (
						<div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-sm">
							-{discountPercentage}%
						</div>
					)}

					{/* Wishlist button */}
					<button
						onClick={handleWishListClick}
						disabled={loading.wishlist}
						aria-label="Add to wishlist"
						className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-all shadow-sm">
						{loading.wishlist ? (
							<div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
						) : (
							<Icon icon="mdi:heart-outline" width="18" height="18" />
						)}
					</button>
				</div>

				{/* Product details with strong hierarchy */}
				<div className="p-3 flex-grow flex flex-col">
					{/* Category tag - small but noticeable */}
					{product.category && (
						<span className="text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded mb-1.5 inline-block w-max">
							{product.category}
						</span>
					)}

					{/* Product name - larger and more prominent */}
					<h3 className="font-semibold text-base text-gray-800 line-clamp-2 mb-1">
						{product.name}
					</h3>

					{/* Price section with clear hierarchy */}
					<div className="mt-auto">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-baseline gap-1.5">
								<span className="text-sm text-gray-900">
									Rs {product.price}
								</span>
								{product.originalPrice && (
									<span className="text-sm text-gray-400 line-through">
										Rs {product.originalPrice}
									</span>
								)}
							</div>
						</div>

						{/* Full width add to cart button */}
						<button
							onClick={handleCartClick}
							disabled={loading.cart}
							aria-label="Add to cart"
							className="w-full py-1.5 px-3 rounded-md bg-primary hover:bg-primary-dark text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors">
							{loading.cart ? (
								<div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
							) : (
								<>
									<Icon icon="mdi:cart-plus" width="18" height="18" />
									<span>Add to Cart</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
}
