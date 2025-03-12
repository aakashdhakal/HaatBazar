"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/app/(server)/actions/products";

const ProductPage = ({ params }) => {
	const [product, setProduct] = useState(null);
	const [resolvedParams, setResolvedParams] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState("description");
	const [isAddedToCart, setIsAddedToCart] = useState(false);

	useEffect(() => {
		const resolveParams = async () => {
			const unwrappedParams = await params;
			setResolvedParams(unwrappedParams);
		};
		resolveParams();
	}, [params]);

	useEffect(() => {
		if (resolvedParams) {
			const fetchProduct = async () => {
				const fetchedProduct = await getProductById(resolvedParams.slug);
				setProduct(fetchedProduct);
			};
			fetchProduct();
		}
	}, [resolvedParams]);

	const handleAddToCart = () => {
		// Add to cart logic here
		setIsAddedToCart(true);
		setTimeout(() => setIsAddedToCart(false), 2000);
	};

	const handleQuantityChange = (change) => {
		const newQuantity = Math.max(1, quantity + change);
		setQuantity(newQuantity);
	};

	// Mock data for demo purposes
	const relatedProducts = [
		{
			id: 1,
			name: "Related Product 1",
			price: 99.99,
			image: "https://source.unsplash.com/random/300x300/?product",
		},
		{
			id: 2,
			name: "Related Product 2",
			price: 89.99,
			image: "https://source.unsplash.com/random/300x301/?product",
		},
		{
			id: 3,
			name: "Related Product 3",
			price: 79.99,
			image: "https://source.unsplash.com/random/300x302/?product",
		},
	];

	if (!product) {
		return (
			<div className="container mx-auto p-8 flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			{/* Breadcrumb */}
			<nav className="flex items-center text-sm text-gray-500 mb-6">
				<Link href="/" className="hover:text-black">
					Home
				</Link>
				<span className="mx-2">/</span>
				<Link href="/products" className="hover:text-black">
					Products
				</Link>
				<span className="mx-2">/</span>
				<span className="text-gray-900 font-medium">{product.name}</span>
			</nav>

			<div className="flex flex-col md:flex-row gap-8 mb-16">
				{/* Product Images */}
				<div className="md:w-1/2">
					<div className="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-video">
						<Image
							src={
								product.image ||
								"https://source.unsplash.com/random/600x600/?product"
							}
							alt={product.name}
							width={600}
							height={600}
							className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
							priority
						/>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer aspect-square">
								<Image
									src={
										product.image ||
										`https://source.unsplash.com/random/150x150/?product&sig=${i}`
									}
									alt={`${product.name} thumbnail ${i + 1}`}
									width={150}
									height={150}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="md:w-1/2">
					<h1 className="text-3xl font-bold mb-2">{product.name}</h1>

					{/* Rating */}
					<div className="flex items-center mb-3">
						<div className="flex text-amber-400 mr-2">
							{[...Array(5)].map((_, i) => (
								<Icon
									key={i}
									icon={
										i < (product.rating || 4) ? "mdi:star" : "mdi:star-outline"
									}
									className="w-5 h-5"
								/>
							))}
						</div>
						<span className="text-gray-500 text-sm">
							({product.reviews || 42} reviews)
						</span>
					</div>

					{/* Price */}
					<div className="mb-4">
						<span className="text-3xl font-bold text-gray-900">
							${product.price}
						</span>
						{product.oldPrice && (
							<span className="ml-2 text-xl text-gray-500 line-through">
								${product.oldPrice}
							</span>
						)}
					</div>

					{/* Stock status */}
					<div className="mb-5">
						<span className="py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full">
							In Stock
						</span>
					</div>

					<p className="text-gray-600 mb-6">{product.description}</p>

					{/* Quantity selector */}
					<div className="flex items-center mb-6">
						<span className="mr-3 text-gray-700">Quantity:</span>
						<div className="flex items-center border border-gray-300 rounded">
							<button
								onClick={() => handleQuantityChange(-1)}
								className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100">
								-
							</button>
							<span className="px-4 py-2">{quantity}</span>
							<button
								onClick={() => handleQuantityChange(1)}
								className="px-4 py-2 border-l border-gray-300 hover:bg-gray-100">
								+
							</button>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex flex-wrap gap-4 mb-8">
						<Button
							onClick={handleAddToCart}
							className={`flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all ${
								isAddedToCart ? "bg-green-600 hover:bg-green-700" : ""
							}`}>
							{isAddedToCart ? "Added!" : "Add to Cart"}
							<Icon icon="mdi:cart" className="w-5 h-5" />
						</Button>

						<Button
							variant="outline"
							className="flex items-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg">
							<Icon icon="mdi:heart" className="w-5 h-5" />
							Add to Wishlist
						</Button>
					</div>

					{/* Product features */}
					<div className="border-t border-gray-200 pt-6">
						<div className="flex items-center gap-3 mb-3">
							<Icon
								icon="mdi:truck-delivery"
								className="text-blue-600 w-5 h-5"
							/>
							<span className="text-gray-700">
								Free shipping on orders over $50
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Icon icon="mdi:shield-check" className="text-blue-600 w-5 h-5" />
							<span className="text-gray-700">2 year extended warranty</span>
						</div>
					</div>
				</div>
			</div>

			{/* Product tabs */}
			<div className="mb-16">
				<div className="border-b border-gray-200 mb-6">
					<div className="flex flex-wrap -mb-px">
						{["description", "specifications", "reviews"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`mr-2 inline-block py-4 px-4 text-sm font-medium capitalize border-b-2 ${
									activeTab === tab
										? "text-blue-600 border-blue-600"
										: "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
								}`}>
								{tab}
							</button>
						))}
					</div>
				</div>

				<div className="py-4">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<p>{product.description}</p>
							<p className="mt-4">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat.
							</p>
						</div>
					)}
					{activeTab === "specifications" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">General</h3>
								<table className="w-full text-sm">
									<tbody>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Brand</td>
											<td className="py-2 text-gray-900">
												{product.brand || "Premium Brand"}
											</td>
										</tr>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Material</td>
											<td className="py-2 text-gray-900">
												{product.material || "High-quality material"}
											</td>
										</tr>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Weight</td>
											<td className="py-2 text-gray-900">
												{product.weight || "0.5 kg"}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Dimensions</h3>
								<table className="w-full text-sm">
									<tbody>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Height</td>
											<td className="py-2 text-gray-900">
												{product.height || "10 cm"}
											</td>
										</tr>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Width</td>
											<td className="py-2 text-gray-900">
												{product.width || "15 cm"}
											</td>
										</tr>
										<tr className="border-b border-gray-200">
											<td className="py-2 text-gray-500">Depth</td>
											<td className="py-2 text-gray-900">
												{product.depth || "5 cm"}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}
					{activeTab === "reviews" && (
						<div>
							<div className="mb-6">
								<h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
								{[...Array(3)].map((_, i) => (
									<div key={i} className="mb-4 pb-4 border-b border-gray-200">
										<div className="flex justify-between mb-2">
											<span className="font-medium">John Doe</span>
											<span className="text-gray-500 text-sm">2 days ago</span>
										</div>
										<div className="flex text-amber-400 mb-2">
											{[...Array(5)].map((_, j) => (
												<Icon
													key={j}
													icon={j < 4 ? "mdi:star" : "mdi:star-outline"}
													className="w-4 h-4"
												/>
											))}
										</div>
										<p className="text-gray-600">
											Great product, exactly as described. Would definitely
											recommend!
										</p>
									</div>
								))}
							</div>
							<Button variant="outline" className="text-sm">
								View all reviews
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Related Products */}
			<div className="mb-16">
				<h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{relatedProducts.map((relatedProduct) => (
						<div
							key={relatedProduct.id}
							className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
							<div className="aspect-square relative overflow-hidden bg-gray-100">
								<Image
									src={relatedProduct.image}
									alt={relatedProduct.name}
									width={300}
									height={300}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-lg font-medium mb-1 text-gray-900">
									{relatedProduct.name}
								</h3>
								<p className="text-gray-900 font-semibold">
									${relatedProduct.price}
								</p>
								<Button className="w-full mt-3 bg-gray-800 hover:bg-gray-900 text-white">
									Quick View
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
