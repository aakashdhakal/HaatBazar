"use client";

import { useState, useEffect } from "react";
import { getProductsByCategory } from "@/app/(server)/actions/products";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/Select";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

export default function CategoryPage() {
	const params = useParams();
	const categorySlug = params.slug;
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState("name");
	const { toast } = useToast();

	// Format category name for display (convert slug to readable form)
	const categoryName = categorySlug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const result = await getProductsByCategory(categorySlug);
				if (result.error) {
					setProducts([]);
				} else {
					setProducts(result);
				}
			} catch (error) {
				console.error("Failed to fetch products:", error);
				toast({
					title: "Error",
					description: "Failed to load products. Please try again.",
					variant: "error",
				});
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [categorySlug, toast]);

	// Sort products based on selected option
	const sortedProducts = [...products].sort((a, b) => {
		switch (sortBy) {
			case "priceLow":
				return a.price - b.price;
			case "priceHigh":
				return b.price - a.price;
			case "newest":
				return new Date(b.createdAt) - new Date(a.createdAt);
			case "rating":
				return (b.rating || 0) - (a.rating || 0);
			default:
				return a.name.localeCompare(b.name);
		}
	});

	return (
		<div className="container max-w-7xl mx-auto px-4 py-8">
			{/* Breadcrumbs */}
			<nav className="flex items-center text-sm text-gray-500 mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<Link href="/products" className="hover:text-primary">
					Products
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<span className="text-gray-700 font-medium capitalize">
					{categoryName}
				</span>
			</nav>

			{/* Category Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
					{categoryName}
				</h1>
				<p className="text-gray-600">
					Browse our collection of {categoryName.toLowerCase()} products
				</p>
			</div>

			{/* Filters and Sorting */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<div className="flex items-center">
					{!loading && (
						<div className="text-sm text-gray-500">
							{products.length} {products.length === 1 ? "product" : "products"}{" "}
							found
						</div>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500">Sort by:</span>
					<SelectComponent
						label="Sort by"
						value={sortBy}
						onValueChange={setSortBy}
						options={[
							{ label: "Name (A-Z)", value: "name" },
							{ label: "Price: Low to High", value: "priceLow" },
							{ label: "Price: High to Low", value: "priceHigh" },
							{ label: "Newest Arrivals", value: "newest" },
							{ label: "Highest Rated", value: "rating" },
						]}
					/>
				</div>
			</div>

			{/* Loading State */}
			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{Array.from({ length: 10 }).map((_, index) => (
						<div key={index} className="flex flex-col gap-4">
							<Skeleton className="w-full aspect-square rounded-md" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-6 w-2/3" />
								<Skeleton className="h-4 w-1/4" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					))}
				</div>
			) : products.length > 0 ? (
				// Products Grid
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{sortedProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			) : (
				// Empty State
				<div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl shadow-sm border border-gray-100">
					<Icon
						icon="mdi:package-variant"
						className="w-16 h-16 text-gray-300 mb-4"
					/>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						No products found
					</h2>
					<p className="text-gray-600 mb-6 max-w-md">
						We couldn't find any products in this category. Please check back
						later or browse our other categories.
					</p>
					<Link href="/products">
						<Button className="bg-primary hover:bg-primary/90 text-white">
							Browse All Products
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
