"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/app/(server)/actions/products";
import { addToCart, getCart } from "@/app/(server)/actions/cart";
import { addToWishList } from "@/app/(server)/actions/wishList";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductPage = ({ params }) => {
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);
	const [loadingAction, setLoadingAction] = useState({
		cart: false,
		wishlist: false,
	});
	const { data: session } = useSession();
	const { setCartItems } = useCart({});
	const { setWishListItemsCount } = useWishList();
	const { success, error } = useToast();

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				const { slug } = await params;
				const fetchedProduct = await getProductById(slug);
				setProduct(fetchedProduct);
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
			success({
				title: "Added to cart",
				description: `${quantity} × ${product.name} added to your cart`,
			});
		} catch (err) {
			error({
				title: "Failed to add to cart",
				description: "Please try again",
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
			success({
				title: "Added to wishlist",
				description: `${product.name} added to your wishlist`,
			});
		} catch (err) {
			error({
				title: "Failed to add to wishlist",
				description: "Please try again",
			});
		} finally {
			setLoadingAction((prev) => ({ ...prev, wishlist: false }));
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Image skeleton */}
					<div className="md:w-1/2">
						<Skeleton className="w-full aspect-square rounded-lg mb-4" />
						<div className="grid grid-cols-4 gap-2">
							{[...Array(4)].map((_, i) => (
								<Skeleton key={i} className="aspect-square rounded-lg" />
							))}
						</div>
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
			<div className="container mx-auto p-8 text-center">
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

	// Generate dummy images for the gallery if not available
	const productImages =
		product.images?.length > 0
			? product.images
			: [product.image, product.image, product.image, product.image].filter(
					Boolean,
			  );

	// If no images are available, use placeholders
	const displayImages =
		productImages?.length > 0
			? productImages
			: [
					"/product-placeholder.jpg",
					"/product-placeholder.jpg",
					"/product-placeholder.jpg",
					"/product-placeholder.jpg",
			  ];

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<nav className="flex items-center text-sm text-gray-500 mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<Link href="/products" className="hover:text-primary">
					Products
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<span className="text-gray-700">{product.name}</span>
			</nav>

			<div className="flex flex-col md:flex-row gap-8 mb-16">
				{/* Product Images */}
				<div className="md:w-1/2">
					<div className="bg-white rounded-lg overflow-hidden border border-gray-100 mb-4">
						<div className="relative aspect-square">
							<Image
								src={displayImages[selectedImage] || "/product-placeholder.jpg"}
								alt={product.name}
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-contain p-4"
								priority
							/>

							{product.discountPercentage > 0 && (
								<Badge className="absolute top-4 left-4 bg-secondary hover:bg-secondary">
									{product.discountPercentage}% OFF
								</Badge>
							)}
						</div>
					</div>

					<div className="grid grid-cols-4 gap-2">
						{displayImages.slice(0, 4).map((image, i) => (
							<div
								key={i}
								className={`relative aspect-square border rounded-md overflow-hidden cursor-pointer ${
									selectedImage === i ? "border-primary" : "border-gray-200"
								}`}
								onClick={() => setSelectedImage(i)}>
								<Image
									src={image}
									alt={`${product.name} thumbnail ${i + 1}`}
									fill
									sizes="(max-width: 768px) 25vw, 10vw"
									className="object-contain p-1"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="md:w-1/2">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							{product.name}
						</h1>

						{product.weight && (
							<p className="text-gray-500 text-sm mb-2">{product.weight}</p>
						)}

						{/* Rating */}
						<div className="flex items-center mb-4">
							<div className="flex text-amber-400 mr-2">
								{[...Array(5)].map((_, i) => (
									<Icon
										key={i}
										icon={
											i < (product.rating || 4)
												? "mdi:star"
												: "mdi:star-outline"
										}
										className="w-4 h-4"
									/>
								))}
							</div>
							<span className="text-gray-500 text-sm">
								{product.reviews || 0} reviews
							</span>
						</div>

						{/* Price */}
						<div className="mb-4">
							<div className="flex items-baseline">
								<span className="text-2xl font-bold text-gray-900">
									Rs {product.price}
								</span>
								{product.originalPrice &&
									product.originalPrice > product.price && (
										<span className="ml-2 text-gray-500 line-through">
											Rs {product.originalPrice}
										</span>
									)}
							</div>

							{product.inStock ? (
								<Badge
									variant="outline"
									className="mt-2 bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
									<Icon icon="mdi:check-circle" className="mr-1 h-3.5 w-3.5" />
									In Stock
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="mt-2 bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
									<Icon icon="mdi:alert-circle" className="mr-1 h-3.5 w-3.5" />
									Out of Stock
								</Badge>
							)}
						</div>
					</div>

					<Separator className="mb-6" />

					{/* Description */}
					<div className="mb-6">
						<p className="text-gray-700">{product.description}</p>
					</div>

					{/* Quantity and Add to Cart */}
					<div className="space-y-6">
						{product.inStock && (
							<div className="flex items-center">
								<span className="mr-4 text-gray-700">Quantity:</span>
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
								disabled={!product.inStock || loadingAction.cart}
								className="flex-1 sm:flex-none sm:min-w-[180px] bg-primary hover:bg-primary-dark text-white">
								{loadingAction.cart ? (
									<>
										<span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
										Adding...
									</>
								) : (
									<>
										<Icon icon="mdi:cart-outline" className="mr-2 h-5 w-5" />
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
										<Icon icon="mdi:heart-outline" className="mr-2 h-5 w-5" />
										Add to Wishlist
									</>
								)}
							</Button>
						</div>
					</div>

					{/* Features */}
					<div className="mt-8 space-y-3">
						<div className="flex items-start">
							<div className="p-1.5 bg-primary/10 rounded text-primary mr-3">
								<Icon icon="mdi:truck-delivery-outline" className="h-5 w-5" />
							</div>
							<div>
								<p className="font-medium text-gray-900">Free Delivery</p>
								<p className="text-sm text-gray-500">For orders over Rs 500</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="p-1.5 bg-primary/10 rounded text-primary mr-3">
								<Icon icon="mdi:fruit-watermelon" className="h-5 w-5" />
							</div>
							<div>
								<p className="font-medium text-gray-900">Fresh Guaranteed</p>
								<p className="text-sm text-gray-500">100% quality guarantee</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Product details tabs */}
			<div className="mb-16">
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="w-full border-b border-gray-200 bg-transparent justify-start mb-6">
						<TabsTrigger
							value="details"
							className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 border-b-2 border-transparent px-5 py-3 rounded-none">
							Details
						</TabsTrigger>
						<TabsTrigger
							value="nutrition"
							className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 border-b-2 border-transparent px-5 py-3 rounded-none">
							Nutrition
						</TabsTrigger>
						<TabsTrigger
							value="reviews"
							className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 border-b-2 border-transparent px-5 py-3 rounded-none">
							Reviews
						</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="pt-2">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold text-lg mb-4">Product Details</h3>
								<p className="text-gray-700 mb-4">
									{product.description ||
										"No detailed description available for this product."}
								</p>
								<p className="text-gray-700">
									Our products are sourced directly from local farmers to ensure
									you get the freshest items delivered to your doorstep. We
									carefully select each item to meet our quality standards.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-4">Specifications</h3>
								<table className="w-full text-left text-sm">
									<tbody className="divide-y divide-gray-200">
										{product.category && (
											<tr>
												<th className="py-2 pr-2 font-medium text-gray-500 w-1/3">
													Category
												</th>
												<td className="py-2 text-gray-700 capitalize">
													{product.category}
												</td>
											</tr>
										)}
										{product.origin && (
											<tr>
												<th className="py-2 pr-2 font-medium text-gray-500 w-1/3">
													Origin
												</th>
												<td className="py-2 text-gray-700">{product.origin}</td>
											</tr>
										)}
										{product.season && (
											<tr>
												<th className="py-2 pr-2 font-medium text-gray-500 w-1/3">
													Best Season
												</th>
												<td className="py-2 text-gray-700">{product.season}</td>
											</tr>
										)}
										{product.weight && (
											<tr>
												<th className="py-2 pr-2 font-medium text-gray-500 w-1/3">
													Weight/Size
												</th>
												<td className="py-2 text-gray-700">{product.weight}</td>
											</tr>
										)}
										{product.storageInfo && (
											<tr>
												<th className="py-2 pr-2 font-medium text-gray-500 w-1/3">
													Storage
												</th>
												<td className="py-2 text-gray-700">
													{product.storageInfo}
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="nutrition" className="pt-2">
						<div className="max-w-2xl">
							<h3 className="font-semibold text-lg mb-4">
								Nutritional Information
							</h3>
							{product.nutritionalInfo ? (
								<table className="w-full text-sm">
									<thead className="bg-gray-50">
										<tr>
											<th className="py-2 px-4 text-left font-medium text-gray-700">
												Nutrient
											</th>
											<th className="py-2 px-4 text-right font-medium text-gray-700">
												Amount per 100g
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{product.nutritionalInfo.calories && (
											<tr>
												<td className="py-2 px-4 text-gray-700">Calories</td>
												<td className="py-2 px-4 text-right text-gray-700">
													{product.nutritionalInfo.calories}
												</td>
											</tr>
										)}
										{product.nutritionalInfo.protein && (
											<tr>
												<td className="py-2 px-4 text-gray-700">Protein</td>
												<td className="py-2 px-4 text-right text-gray-700">
													{product.nutritionalInfo.protein}
												</td>
											</tr>
										)}
										{product.nutritionalInfo.carbs && (
											<tr>
												<td className="py-2 px-4 text-gray-700">
													Carbohydrates
												</td>
												<td className="py-2 px-4 text-right text-gray-700">
													{product.nutritionalInfo.carbs}
												</td>
											</tr>
										)}
										{product.nutritionalInfo.fiber && (
											<tr>
												<td className="py-2 px-4 text-gray-700">Fiber</td>
												<td className="py-2 px-4 text-right text-gray-700">
													{product.nutritionalInfo.fiber}
												</td>
											</tr>
										)}
										{product.nutritionalInfo.fat && (
											<tr>
												<td className="py-2 px-4 text-gray-700">Fat</td>
												<td className="py-2 px-4 text-right text-gray-700">
													{product.nutritionalInfo.fat}
												</td>
											</tr>
										)}
									</tbody>
								</table>
							) : (
								<div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
									Nutritional information not available for this product.
								</div>
							)}

							<div className="mt-4 text-sm text-gray-500">
								<p>
									* Nutritional information is approximate and may vary based on
									exact product and serving size.
								</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="reviews" className="pt-2">
						<div className="max-w-3xl">
							<div className="flex justify-between items-center mb-6">
								<h3 className="font-semibold text-lg">Customer Reviews</h3>
								<Button variant="outline" className="text-sm">
									Write a Review
								</Button>
							</div>

							{/* Reviews list */}
							{product.reviewsList?.length > 0 ? (
								<div className="space-y-6">
									{product.reviewsList?.map((review, i) => (
										<div key={i} className="border-b border-gray-200 pb-6">
											<div className="flex justify-between mb-2">
												<div>
													<p className="font-medium text-gray-900">
														{review.name}
													</p>
													<div className="flex text-amber-400 my-1">
														{[...Array(5)].map((_, j) => (
															<Icon
																key={j}
																icon={
																	j < review.rating
																		? "mdi:star"
																		: "mdi:star-outline"
																}
																className="w-4 h-4"
															/>
														))}
													</div>
												</div>
												<span className="text-gray-500 text-sm">
													{review.date}
												</span>
											</div>
											<p className="text-gray-700">{review.comment}</p>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-10 text-gray-500">
									<Icon
										icon="mdi:star-outline"
										className="w-12 h-12 mx-auto mb-2 opacity-30"
									/>
									<p>No reviews yet. Be the first to review this product!</p>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Related Products */}
			<div className="mb-16">
				<h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{/* We'll use placeholder products since we don't have actual related products */}
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all bg-white group">
							<div className="relative aspect-square bg-gray-50">
								<Image
									src={"/public/sel.jpg"}
									alt={`Related Product ${i}`}
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									className="object-contain p-4"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
									{
										[
											"Fresh Tomatoes",
											"Organic Apples",
											"Green Spinach",
											"Fresh Carrots",
										][i - 1]
									}
								</h3>
								<p className="text-xs text-gray-500 mt-1">
									{["500g", "1kg pack", "250g bunch", "500g pack"][i - 1]}
								</p>
								<div className="mt-2">
									<span className="text-gray-900 font-medium">
										Rs {[120, 180, 60, 80][i - 1]}
									</span>
								</div>
								<Button className="w-full mt-3 bg-primary/10 hover:bg-primary hover:text-white text-primary">
									View Product
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
