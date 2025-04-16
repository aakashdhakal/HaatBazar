"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/Rating";
import { getProductById } from "@/app/(server)/actions/products";
import { addToCart, getCart } from "@/app/(server)/actions/cart";
import { addToWishList } from "@/app/(server)/actions/wishList";
import { getProductReviews } from "@/app/(server)/actions/reviews";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewModal from "@/components/ReviewModal";
import { getUserById } from "@/app/(server)/actions/users";

const ProductPage = ({ params }) => {
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [loadingAction, setLoadingAction] = useState({
		cart: false,
		wishlist: false,
	});
	const [reviews, setReviews] = useState([]);
	const [reviewModalOpen, setReviewModalOpen] = useState(false);

	const { data: session, status } = useSession();
	const { setCartItems } = useCart({});
	const { setWishListItemsCount } = useWishList();
	const { toast } = useToast();

	const fetchReviews = async (productId) => {
		try {
			const result = await getProductReviews(productId);
			if (result.success) {
				setReviews(result.reviews);
			}
		} catch (err) {
			console.error("Failed to fetch reviews:", err);
		}
	};

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				const { slug } = await params;
				const fetchedProduct = await getProductById(slug);
				setProduct(fetchedProduct);

				// Fetch reviews after getting product
				if (fetchedProduct && fetchedProduct._id) {
					fetchReviews(fetchedProduct._id);
				}
			} catch (err) {
				console.error("Failed to fetch product:", err);
			} finally {
				setLoading(false);
			}
		};

		if (params) {
			fetchProduct();
		}
	}, [params]);

	const handleQuantityChange = (change) => {
		const newQuantity = Math.max(1, quantity + change);
		setQuantity(newQuantity);
	};

	const handleAddToCart = async () => {
		setLoadingAction((prev) => ({ ...prev, cart: true }));
		try {
			await addToCart({ _id: product._id, quantity });
			setCartItems(await getCart());
			toast({
				title: "Added to cart",
				description: `${quantity} × ${product.name} added to your cart`,
				variant: "success",
			});
		} catch (err) {
			toast({
				title: "Failed to add to cart",
				description: "Please try again",
				variant: "destructive",
			});
		} finally {
			setLoadingAction((prev) => ({ ...prev, cart: false }));
		}
	};

	const handleAddToWishlist = async () => {
		setLoadingAction((prev) => ({ ...prev, wishlist: true }));
		try {
			const result = await addToWishList({ _id: product._id });
			setWishListItemsCount(result.noOfItems);
			toast({
				title: "Added to wishlist",
				description: `${product.name} added to your wishlist`,
				variant: "success",
			});
		} catch (err) {
			toast({
				title: "Failed to add to wishlist",
				description: "Please try again",
				variant: "destructive",
			});
		} finally {
			setLoadingAction((prev) => ({ ...prev, wishlist: false }));
		}
	};

	const handleReviewSuccess = (updatedProduct) => {
		// Update product data with new rating
		setProduct(updatedProduct);

		// Refresh the reviews list
		if (product && product._id) {
			fetchReviews(product._id);
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="container max-w-6xl mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Image skeleton */}
					<div className="md:w-1/2">
						<Skeleton className="w-full aspect-square rounded-lg" />
					</div>

					{/* Content skeleton */}
					<div className="md:w-1/2">
						<Skeleton className="h-10 w-3/4 mb-4" />
						<Skeleton className="h-6 w-1/3 mb-4" />
						<Skeleton className="h-8 w-1/4 mb-4" />
						<Skeleton className="h-5 w-1/5 mb-6" />
						<Skeleton className="h-24 w-full mb-6" />
						<div className="flex items-center mb-6">
							<Skeleton className="h-10 w-32 mr-4" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="container max-w-6xl mx-auto p-8 text-center">
				<div className="text-primary/70 mb-4">
					<Icon icon="mdi:alert-circle-outline" className="w-16 h-16 mx-auto" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Product not found
				</h1>
				<p className="text-gray-500 mb-8">
					Sorry, we couldn&apos;t find the product you&apos;re looking for.
				</p>
				<Link href="/products">
					<Button className="bg-primary hover:bg-primary-dark text-white">
						Browse products
					</Button>
				</Link>
			</div>
		);
	}

	// Determine if product is in stock
	const inStock = product.countInStock > 0;

	return (
		<div className="container max-w-6xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<nav className="flex items-center text-sm text-gray-500 mb-8">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<Link href="/products" className="hover:text-primary">
					Products
				</Link>
				{product.category && (
					<>
						<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
						<Link
							href={`/category/${product.category}`}
							className="hover:text-primary capitalize">
							{product.category}
						</Link>
					</>
				)}
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<span className="text-gray-700">{product.name}</span>
			</nav>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
				<div className="flex flex-col md:flex-row">
					{/* Product Image */}
					<div className="md:w-2/5 p-6 bg-gray-50 flex items-center justify-center">
						<div className="relative aspect-square w-full max-w-md">
							<Image
								src={product.image || "/product-placeholder.jpg"}
								alt={product.name}
								fill
								sizes="(max-width: 768px) 100vw, 40vw"
								className="object-contain"
								priority
							/>
						</div>
					</div>

					{/* Product Info */}
					<div className="md:w-3/5 p-8">
						<div className="flex flex-col h-full">
							{/* Header info */}
							<div className="mb-6">
								<div className="flex justify-between items-start mb-2">
									<h1 className="text-2xl font-bold text-gray-900">
										{product.name}
									</h1>
									<Badge
										className={
											inStock
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}>
										{inStock ? "In Stock" : "Out of Stock"}
									</Badge>
								</div>

								{product.category && (
									<div className="flex items-center text-sm text-gray-600 mb-4">
										<Icon icon="mdi:tag" className="mr-1 h-4 w-4" />
										<span className="capitalize">{product.category}</span>
									</div>
								)}

								{/* Rating */}
								<div className="flex items-center mb-4">
									<div className="flex text-amber-400 mr-2">
										{[...Array(5)].map((_, i) => (
											<Icon
												key={i}
												icon={
													i < (product.rating || 0)
														? "mdi:star"
														: "mdi:star-outline"
												}
												className="w-4 h-4"
											/>
										))}
									</div>
									<Link
										href="#reviews"
										className="text-gray-500 text-sm hover:text-primary">
										{product.numReviews || 0} reviews
									</Link>
								</div>
							</div>

							<Separator />

							{/* Price section */}
							<div className="my-6">
								<div className="flex items-baseline">
									<span className="text-3xl font-bold text-gray-900">
										Rs {product.price}
									</span>
									{product.quantityPrice && (
										<span className="ml-2 text-sm text-gray-500">
											{product.quantityPrice}
										</span>
									)}
								</div>
							</div>

							{/* Description */}
							<div className="mb-8 flex-grow">
								<h3 className="text-sm font-medium text-gray-700 mb-2">
									Description
								</h3>
								<p className="text-gray-600">{product.description}</p>
							</div>

							{/* Product Details */}
							{(product.brand || product.countInStock !== undefined) && (
								<div className="mb-8">
									<h3 className="text-sm font-medium text-gray-700 mb-2">
										Product Details
									</h3>
									<div className="grid grid-cols-2 gap-4 text-sm">
										{product.brand && (
											<div className="flex items-center">
												<span className="text-gray-500 mr-2">Brand:</span>
												<span className="text-gray-900">{product.brand}</span>
											</div>
										)}
										{product.countInStock !== undefined && (
											<div className="flex items-center">
												<span className="text-gray-500 mr-2">Available:</span>
												<span className="text-gray-900">
													{product.countInStock} in stock
												</span>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Quantity and Add to Cart */}
							<div className="space-y-4 mt-auto">
								{inStock && (
									<div className="flex items-center">
										<span className="mr-4 text-gray-700 font-medium">
											Quantity:
										</span>
										<div className="flex items-center border border-gray-200 rounded-md">
											<button
												onClick={() => handleQuantityChange(-1)}
												disabled={quantity <= 1}
												className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300">
												<Icon icon="mdi:minus" className="w-4 h-4" />
											</button>
											<span className="w-12 text-center">{quantity}</span>
											<button
												onClick={() => handleQuantityChange(1)}
												disabled={quantity >= product.countInStock}
												className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700">
												<Icon icon="mdi:plus" className="w-4 h-4" />
											</button>
										</div>
									</div>
								)}

								{/* Action buttons */}
								<div className="flex flex-wrap gap-4">
									<Button
										onClick={handleAddToCart}
										disabled={!inStock || loadingAction.cart}
										className="flex-1 sm:flex-none sm:min-w-[180px] bg-primary hover:bg-primary/90 text-white">
										{loadingAction.cart ? (
											<>
												<span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
												Adding...
											</>
										) : (
											<>
												<Icon
													icon="mdi:cart-outline"
													className="mr-2 h-5 w-5"
												/>
												Add to Cart
											</>
										)}
									</Button>

									<Button
										onClick={handleAddToWishlist}
										disabled={loadingAction.wishlist}
										variant="outline"
										className="flex-1 sm:flex-none sm:min-w-[180px] border-gray-200 hover:bg-gray-50 hover:text-primary">
										{loadingAction.wishlist ? (
											<>
												<span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2"></span>
												Adding...
											</>
										) : (
											<>
												<Icon
													icon="mdi:heart-outline"
													className="mr-2 h-5 w-5"
												/>
												Add to Wishlist
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Reviews Section */}
			<div
				id="reviews"
				className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold">Reviews & Ratings</h2>
					<Button
						onClick={() => setReviewModalOpen(true)}
						className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
						<Icon icon="mdi:pencil" className="h-4 w-4" />
						Write a Review
					</Button>
				</div>

				{reviews.length > 0 ? (
					<div className="space-y-6">
						{reviews.map((review, index) => (
							<div
								key={review._id}
								className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
								<div className="flex justify-between mb-2">
									<div className="flex items-center gap-2">
										{review.image ? (
											// Display user profile image if available
											<div className="h-10 w-10 relative rounded-full overflow-hidden">
												<Image
													src={review.image}
													alt={review.name || "User"}
													fill
													className="object-cover"
													sizes="40px"
												/>
											</div>
										) : (
											// Fallback to initials if no profile image
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
												{review.name
													? review.name.charAt(0).toUpperCase()
													: "U"}
											</div>
										)}
										<div>
											<p className="font-medium">
												{review.name || "Anonymous"}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(review.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="flex text-amber-400">
										{[...Array(5)].map((_, i) => (
											<Icon
												key={i}
												icon={
													i < review.rating ? "mdi:star" : "mdi:star-outline"
												}
												className="w-4 h-4"
											/>
										))}
									</div>
								</div>
								<p className="text-gray-600">{review.comment}</p>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-10">
						<Icon
							icon="mdi:comment-text-outline"
							className="w-16 h-16 mx-auto text-gray-300 mb-4"
						/>
						<h3 className="text-lg font-medium text-gray-700 mb-2">
							No reviews yet
						</h3>
						<p className="text-gray-500 mb-4">
							Be the first to review this product
						</p>
						<Button onClick={() => setReviewModalOpen(true)} variant="outline">
							Write a Review
						</Button>
					</div>
				)}
			</div>

			{/* Review Modal */}
			<ReviewModal
				productId={product._id}
				productName={product.name}
				isOpen={reviewModalOpen}
				onClose={() => setReviewModalOpen(false)}
				onSuccess={handleReviewSuccess}
			/>
		</div>
	);
};

export default ProductPage;
