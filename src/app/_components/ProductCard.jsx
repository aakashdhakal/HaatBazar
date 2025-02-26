"use client"; // Indicates that this component is a client-side component
import Image from "next/image"; // Importing Image component from Next.js for optimized images
import { Button } from "./ui/button"; // Importing Button component from the local ui folder
import { Icon } from "@iconify/react"; // Importing Icon component from Iconify for using icons
import { useToast } from "../hooks/use-toast"; // Importing custom hook for toast notifications
import { useState } from "react"; // Importing useState hook from React for state management
import { addToCart, getCart } from "../actions/cart"; // Importing cart actions
import { addToWishList } from "../actions/wishList"; // Importing wishlist actions
import { useCart } from "../context/CartContext"; // Importing Cart context
import { useWishList } from "../context/WishListContext"; // Importing Wishlist context
import Link from "next/link";

export default function ProductCard({ product }) {
	const [loading, setLoading] = useState({ cart: false, wishlist: false }); // State for loading status of cart and wishlist actions
	const { setCartItems } = useCart({}); // Destructuring setCartItems from Cart context
	const { setWishListItemsCount } = useWishList(); // Destructuring setWishListItemsCount from Wishlist context
	const { toast } = useToast(); // Destructuring toast function from useToast hook

	const handleCartClick = async (e) => {
		e.preventDefault(); // Prevent default link behavior
		e.stopPropagation();
		setLoading((prev) => ({ ...prev, cart: true })); // Set loading state for cart action
		await addToCart({ _id: product._id, quantity: 1 }); // Add product to cart
		setCartItems(await getCart()); // Update cart items in context
		toast({
			title: product.name + " added to the cart", // Show toast notification
		});
		setLoading((prev) => ({ ...prev, cart: false })); // Reset loading state for cart action
	};

	const handleWishListClick = async (e) => {
		e.preventDefault(); // Prevent default link behavior
		e.stopPropagation();
		setLoading((prev) => ({ ...prev, wishlist: true })); // Set loading state for wishlist action
		const data = await addToWishList({ _id: product._id }); // Add product to wishlist
		setWishListItemsCount(data.noOfItems); // Update wishlist items count in context
		toast({
			title: product.name + " added to the wishlist", // Show toast notification
		});
		setLoading((prev) => ({ ...prev, wishlist: false })); // Reset loading state for wishlist action
	};

	return (
		<Link href={`/product/${product._id}`}>
			<div
				className="flex flex-col  gap-2 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow
	  duration-300 w-60 h-80">
				{/* Card container with styling */}
				<div className="w-full h-40 relative">
					{" "}
					{/* Image container with fixed size */}
					<Image
						src={product.image}
						alt={product.name}
						fill="responsive"
						className="rounded-lg object-cover"
						priority={true}
						sizes="100%"
					/>
					{/* Product image */}
				</div>
				<h2 className="text-l font-semibold text-gray-800">{product.name}</h2>{" "}
				{/* Product name */}
				<p className="text-l text-gray-600">Rs {product.price}</p>{" "}
				{/* Product price */}
				<div className="flex justify-between items-center gap-4">
					{/* Buttons container */}
					<Button
						variant="default"
						onClick={handleCartClick}
						isLoading={loading.cart}
						loadingtext="Adding "
						className="w-full">
						Add to Cart
					</Button>
					{/* Add to Cart button */}
					<Button
						variant="outline"
						size="icon"
						onClick={handleWishListClick}
						isLoading={loading.wishlist}
						className="w-12 h-full">
						<Icon icon="solar:heart-linear" width="2rem" height="2rem" />
					</Button>
					{/* Add to Wishlist button */}
				</div>
			</div>
		</Link>
	);
}
