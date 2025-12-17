"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getAllProducts from "@/app/(server)/actions/products";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SelectComponent from "@/components/Select";

export default function ProductsPage() {
	// State for products and loading
	const [allProducts, setAllProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [paginatedProducts, setPaginatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);

	// Get router and search params
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get pagination and filter parameters
	const currentPage = parseInt(searchParams.get("page") || "1");
	const limit = 12;
	const sort = searchParams.get("sort") || "newest";
	const priceRange = searchParams.get("price") || "";

	// Fetch products
	useEffect(() => {
		async function fetchProducts() {
			setLoading(true);
			try {
				const products = await getAllProducts();
				setAllProducts(products);
			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, []);

	// Apply filtering based on price
	useEffect(() => {
		if (allProducts.length === 0) return;

		let filtered = [...allProducts];

		if (priceRange) {
			filtered = allProducts.filter((product) => {
				const price = parseFloat(product.price);

				if (priceRange === "0-1000") {
					return price < 1000;
				} else if (priceRange === "1000-5000") {
					return price >= 1000 && price <= 5000;
				} else if (priceRange === "5000-10000") {
					return price >= 5000 && price <= 10000;
				} else if (priceRange === "10000-50000") {
					return price >= 10000 && price <= 50000;
				} else if (priceRange === "50000+") {
					return price >= 50000;
				}

				return true;
			});
		}

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
	}, [allProducts, priceRange, sort, limit]);

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

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="text-xl">Loading products...</p>
			</div>
		);
	}

	return (
		<div className="md:container mx-auto px-0 md:px-4 py-4 md:py-8 pb-20 md:pb-8">
			<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 px-4 md:px-0">
				All Products
			</h1>

			{/* Filters and Sorting */}
			<div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6 bg-card md:bg-transparent px-4 md:px-0 py-3 md:py-0 sticky md:static top-0 z-10 border-b md:border-0 border-border">
				<div className="md:w-64">
					<h2 className="text-lg font-semibold mb-2">Sort By</h2>
					<SelectComponent
						options={[
							{ value: "newest", label: "Newest" },
							{ value: "price-asc", label: "Price: Low to High" },
							{ value: "price-desc", label: "Price: High to Low" },
							{ value: "name-asc", label: "Name: A to Z" },
						]}
						defaultValue={sort}
						onChange={handleSortChange}
					/>
				</div>
			</div>

			{/* Product count and current filter info */}
			<div className="mb-4 text-gray-600 px-4 md:px-0">
				Showing {paginatedProducts.length} of {totalProducts} products
				{priceRange && <span> (Filtered by price)</span>}
			</div>

			{/* Products Grid */}
			{paginatedProducts.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-0">
					{paginatedProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-xl text-gray-600">No products found</p>
					<p className="mt-2 text-gray-500">Try adjusting your filters</p>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-8">
					<nav className="inline-flex rounded-md shadow">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(
							(pageNum) => (
								<button
									key={pageNum}
									onClick={() => handlePageChange(pageNum)}
									className={`px-4 py-2 border ${
										currentPage === pageNum
											? "bg-blue-500 text-white"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}>
									{pageNum}
								</button>
							),
						)}
					</nav>
				</div>
			)}
		</div>
	);
}
