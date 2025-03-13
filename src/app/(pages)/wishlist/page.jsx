/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	getWishList,
	removeFromWishList,
} from "@/app/(server)/actions/wishList";
import { addToCart, getCart } from "@/app/(server)/actions/cart";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
	const [wishlistItems, setWishlistItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingStates, setLoadingStates] = useState({});
	const { toast, success, error } = useToast();
	const { data: session, status } = useSession();
	const router = useRouter();
	const { setCartItems } = useCart({});
	const { setWishListItemsCount } = useWishList();

	useEffect(() => {
		// Redirect if not logged in
		if (status === "unauthenticated") {
			router.push("/login?callbackUrl=/wishlist");
			return;
		}

		if (status === "authenticated") {
			const fetchWishlist = async () => {
				setIsLoading(true);
				try {
					const items = await getWishList();
					setWishlistItems(items);
				} catch (err) {
					error({
						title: "Failed to load wishlist",
						description: "Please try again later",
					});
				} finally {
					setIsLoading(false);
				}
			};

			fetchWishlist();
		}
	}, [status, router]); // 👈 Removed error

	const handleRemoveFromWishlist = async (productId, productName) => {
		setLoadingStates((prev) => ({ ...prev, [productId]: { removing: true } }));
		try {
			const result = await removeFromWishList({ _id: productId });
			// Update wishlist items count in context
			setWishListItemsCount(result.noOfItems);
			// Update local state for immediate UI feedback
			setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
			success({
				title: "Removed from wishlist",
				description: `${productName} has been removed from your wishlist`,
			});
		} catch (err) {
			error({
				title: "Failed to remove item",
				description: "Please try again",
			});
		} finally {
			setLoadingStates((prev) => ({
				...prev,
				[productId]: { removing: false },
			}));
		}
	};

	const handleMoveToCart = async (product) => {
		setLoadingStates((prev) => ({ ...prev, [product._id]: { moving: true } }));
		try {
			// Add to cart
			await addToCart({ _id: product._id, quantity: 1 });
			// Update cart items in context
			setCartItems(await getCart());
			// Remove from wishlist
			const result = await removeFromWishList({ _id: product._id });
			// Update wishlist items count in context
			setWishListItemsCount(result.noOfItems);
			// Update local state for immediate UI feedback
			setWishlistItems((prev) =>
				prev.filter((item) => item._id !== product._id),
			);

			success({
				title: "Added to cart",
				description: `${product.name} has been moved to your cart`,
			});
		} catch (err) {
			error({
				title: "Failed to move item",
				description: "Please try again",
			});
		} finally {
			setLoadingStates((prev) => ({
				...prev,
				[product._id]: { moving: false },
			}));
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-900">My Wishlist</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="border border-gray-200 rounded-lg overflow-hidden">
							<Skeleton className="h-48 w-full" />
							<div className="p-4">
								<Skeleton className="h-5 w-3/4 mb-2" />
								<Skeleton className="h-4 w-1/2 mb-4" />
								<div className="flex justify-between">
									<Skeleton className="h-6 w-16" />
									<div className="flex gap-2">
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-8 w-8 rounded-full" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Empty wishlist
	if (wishlistItems.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-900">My Wishlist</h1>
				<div className="flex flex-col items-center justify-center py-16">
					<div className="text-primary/70 mb-6">
						<Icon icon="mdi:heart-outline" className="w-24 h-24" />
					</div>
					<h2 className="text-xl font-semibold mb-2 text-gray-800">
						Your wishlist is empty
					</h2>
					<p className="text-gray-500 mb-8 text-center max-w-md">
						Items added to your wishlist will appear here. Start exploring our
						products and add your favorites!
					</p>
					<Link href="/">
						<Button className="bg-primary hover:bg-primary-dark text-white">
							Start Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
				<p className="text-gray-500">{wishlistItems.length} items</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{wishlistItems.map((product) => (
					<div
						key={product._id}
						className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white group">
						<Link href={`/product/${product._id}`} className="block">
							<div className="relative h-48 bg-gray-50">
								<Image
									src={product.image || "/product-placeholder.jpg"}
									alt={product.name}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-contain p-4"
								/>

								{product.originalPrice &&
									product.originalPrice > product.price && (
										<div className="absolute top-2 left-2 bg-secondary/90 text-white text-xs px-2 py-1 rounded-full">
											{Math.round(
												((product.originalPrice - product.price) /
													product.originalPrice) *
													100,
											)}
											% OFF
										</div>
									)}
							</div>
						</Link>

						<div className="p-4">
							<Link href={`/product/${product._id}`} className="block">
								<h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
									{product.name}
								</h3>
								<p className="text-gray-500 text-xs mb-2">{product.weight}</p>
							</Link>

							<div className="flex justify-between items-center">
								<div className="flex items-baseline">
									<span className="text-gray-900 font-medium">
										Rs {product.price?.toFixed(2)}
									</span>
									{product.originalPrice &&
										product.originalPrice > product.price && (
											<span className="text-gray-500 text-xs line-through ml-2">
												Rs {product.originalPrice?.toFixed(2)}
											</span>
										)}
								</div>

								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											handleRemoveFromWishlist(product._id, product.name)
										}
										disabled={loadingStates[product._id]?.removing}
										className="h-8 w-8 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50">
										{loadingStates[product._id]?.removing ? (
											<div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
										) : (
											<Icon icon="mdi:trash-outline" className="h-4 w-4" />
										)}
									</Button>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleMoveToCart(product)}
										disabled={loadingStates[product._id]?.moving}
										className="h-8 w-8 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10">
										{loadingStates[product._id]?.moving ? (
											<div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
										) : (
											<Icon icon="mdi:cart-outline" className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 flex justify-center">
				<Link href="/">
					<Button variant="outline" className="flex items-center gap-2">
						<Icon icon="mdi:arrow-left" className="h-4 w-4" />
						Continue Shopping
					</Button>
				</Link>
			</div>
		</div>
	);
}
