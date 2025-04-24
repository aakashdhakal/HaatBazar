"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getAllProducts from "@/app/(server)/actions/products";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import SelectComponent from "@/components/Select";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
	// State for products and loading
	const [allProducts, setAllProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [paginatedProducts, setPaginatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);
	const { toast } = useToast();

	// Get router and search params
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get pagination and sorting parameters
	// Removed priceRange since we're removing that filter
	const currentPage = parseInt(searchParams.get("page") || "1");
	const limit = 15; // 5 columns × 3 rows
	const sort = searchParams.get("sort") || "newest";

	// Fetch products
	useEffect(() => {
		async function fetchProducts() {
			setLoading(true);
			try {
				const products = await getAllProducts();
				setAllProducts(products);
			} catch (error) {
				console.error("Error fetching products:", error);
				toast({
					title: "Error",
					description: "Failed to load products. Please try again.",
					variant: "error",
				});
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, [toast]);

	// Apply sorting and filtering
	useEffect(() => {
		if (allProducts.length === 0) return;

		// Create a copy of allProducts to avoid mutating the original
		let filtered = [...allProducts];

		// Apply sorting
		switch (sort) {
			case "price-asc":
				filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
				break;
			case "price-desc":
				filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
				break;
			case "name-asc":
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "newest":
			default:
				if (filtered[0]?.createdAt) {
					filtered.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
					);
				}
				break;
		}

		setFilteredProducts(filtered);
		setTotalProducts(filtered.length);
		setTotalPages(Math.ceil(filtered.length / limit));
	}, [allProducts, sort, limit]);

	// Apply pagination
	useEffect(() => {
		if (filteredProducts.length === 0) return;

		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;
		setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
	}, [filteredProducts, currentPage, limit]);

	// Handle sort change
	const handleSortChange = (value) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", value);
		params.set("page", "1"); // Reset to page 1 when sorting changes
		router.push(`/products?${params.toString()}`);
	};

	// Handle page change
	const handlePageChange = (pageNum) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", pageNum.toString());
		router.push(`/products?${params.toString()}`);
	};

	return (
		<div className="container max-w-7xl mx-auto px-4 py-8">
			{/* Breadcrumbs */}
			<nav className="flex items-center text-sm text-gray-500 mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4" />
				<span className="text-gray-700 font-medium">Products</span>
			</nav>

			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
				<p className="text-gray-600">
					Browse our complete collection of quality products
				</p>
			</div>

			{/* Sorting and Product Count */}
			<div className="flex justify-between items-center mb-6">
				<div className="text-sm text-gray-500">
					{!loading && (
						<span>
							Showing {paginatedProducts.length} of {totalProducts} products
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500">Sort by:</span>
					<SelectComponent
						value={sort}
						onValueChange={handleSortChange}
						options={[
							{ label: "Newest", value: "newest" },
							{ label: "Price: Low to High", value: "price-asc" },
							{ label: "Price: High to Low", value: "price-desc" },
							{ label: "Name (A-Z)", value: "name-asc" },
						]}
					/>
				</div>
			</div>

			{/* Loading State */}
			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{Array.from({ length: limit }).map((_, index) => (
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
			) : paginatedProducts.length > 0 ? (
				// Products Grid
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{paginatedProducts.map((product) => (
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
						We couldn't find any products matching your criteria. Please try
						again later.
					</p>
					<Button
						className="bg-primary hover:bg-primary/90 text-white"
						onClick={() => {
							router.push("/products");
						}}>
						View All Products
					</Button>
				</div>
			)}

			{/* Pagination */}
			{!loading && totalPages > 1 && (
				<div className="flex justify-center mt-8">
					<nav className="inline-flex rounded-md shadow">
						{currentPage > 1 && (
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								className="px-3 py-2 border bg-white text-gray-700 hover:bg-gray-50 rounded-l-md flex items-center">
								<Icon icon="mdi:chevron-left" className="h-4 w-4" />
							</button>
						)}

						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter(
								(pageNum) =>
									pageNum === 1 ||
									pageNum === totalPages ||
									(pageNum >= currentPage - 1 && pageNum <= currentPage + 1),
							)
							.map((pageNum, index, array) => {
								// Add ellipsis
								if (index > 0 && pageNum > array[index - 1] + 1) {
									return (
										<span
											key={`ellipsis-${pageNum}`}
											className="px-4 py-2 border bg-white text-gray-400">
											...
										</span>
									);
								}

								return (
									<button
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										className={`px-4 py-2 border ${
											currentPage === pageNum
												? "bg-primary text-white"
												: "bg-white text-gray-700 hover:bg-gray-50"
										}`}>
										{pageNum}
									</button>
								);
							})}

						{currentPage < totalPages && (
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								className="px-3 py-2 border bg-white text-gray-700 hover:bg-gray-50 rounded-r-md flex items-center">
								<Icon icon="mdi:chevron-right" className="h-4 w-4" />
							</button>
						)}
					</nav>
				</div>
			)}
		</div>
	);
}
