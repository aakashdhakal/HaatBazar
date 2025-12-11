"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import getAllProducts from "@/app/(server)/actions/products";
import ProductCard from "@/components/ProductCard";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function SearchPage() {
	// Navigation and session hooks
	const { slug } = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session } = useSession();
	const { toast } = useToast();
	const { addToCart } = useCart();
	const { addToWishList } = useWishList();

	// States
	const [allProducts, setAllProducts] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [paginatedResults, setPaginatedResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalResults, setTotalResults] = useState(0);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState("relevance");
	const [priceRange, setPriceRange] = useState({ min: "", max: "" });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loadingStates, setLoadingStates] = useState({});
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	// Search parameters
	const searchQuery = decodeURIComponent(slug || "");
	const categoryFilter = searchParams.get("category") || "";
	const itemsPerPage = 12;

	// Fetch all products once
	useEffect(() => {
		async function fetchProducts() {
			setIsLoading(true);
			try {
				const products = await getAllProducts();
				setAllProducts(products);

				// Extract unique categories from products
				const uniqueCategories = [
					...new Set(products.map((p) => p.category).filter(Boolean)),
				];
				setCategories(uniqueCategories);
			} catch (error) {
				console.error("Error fetching products:", error);
				toast({
					variant: "error",
					title: "Error",
					description: "Failed to fetch products. Please try again.",
				});
			} finally {
				setIsLoading(false);
			}
		}
		fetchProducts();
	}, [toast]);

	// Filter and sort products based on search query and filters
	useEffect(() => {
		if (allProducts.length === 0) return;

		let filtered = allProducts.filter((product) => {
			// Search by name, description, category, or brand
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				product.name?.toLowerCase().includes(searchLower) ||
				product.description?.toLowerCase().includes(searchLower) ||
				product.category?.toLowerCase().includes(searchLower) ||
				product.brand?.toLowerCase().includes(searchLower);

			if (!matchesSearch) return false;

			// Category filter
			if (selectedCategories.length > 0) {
				if (!selectedCategories.includes(product.category)) return false;
			}

			// Price range filter
			if (
				priceRange.min &&
				parseFloat(product.price) < parseFloat(priceRange.min)
			)
				return false;
			if (
				priceRange.max &&
				parseFloat(product.price) > parseFloat(priceRange.max)
			)
				return false;

			return true;
		});

		// Apply sorting
		switch (sortBy) {
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
				if (filtered[0]?.createdAt) {
					filtered.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
					);
				}
				break;
			case "relevance":
			default:
				// Keep original order (relevance by default)
				break;
		}

		setSearchResults(filtered);
		setTotalResults(filtered.length);
	}, [allProducts, searchQuery, selectedCategories, priceRange, sortBy]);

	// Paginate results
	useEffect(() => {
		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		setPaginatedResults(searchResults.slice(startIndex, endIndex));
	}, [searchResults, page, itemsPerPage]);

	// Handle adding to cart
	const handleAddToCart = async (productId) => {
		setLoadingStates((prev) => ({ ...prev, [productId]: true }));

		try {
			await addToCart(productId, 1);
			toast({
				title: "Added to cart",
				description: "Item has been added to your cart",
				variant: "success",
			});
		} catch (err) {
			toast({
				variant: "error",
				title: "Error",
				description: err.message || "Failed to add item to cart",
			});
		} finally {
			setLoadingStates((prev) => ({ ...prev, [productId]: false }));
		}
	};

	// Handle adding to wishlist
	const handleAddToWishlist = async (productId) => {
		if (!session) {
			toast({
				variant: "error",
				title: "Authentication required",
				description: "Please login to save items to your wishlist",
			});
			return;
		}

		setLoadingStates((prev) => ({ ...prev, [`wish-${productId}`]: true }));

		try {
			await addToWishList(productId);
			toast({
				title: "Added to wishlist",
				description: "Item has been added to your wishlist",
				variant: "success",
			});
		} catch (err) {
			toast({
				variant: "error",
				title: "Error",
				description: err.message || "Failed to add item to wishlist",
			});
		} finally {
			setLoadingStates((prev) => ({ ...prev, [`wish-${productId}`]: false }));
		}
	};

	// Handle price range filter
	const handlePriceRangeSubmit = (e) => {
		e.preventDefault();
		setPage(1);
	};

	// Handle category selection
	const handleCategoryToggle = (category) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((c) => c !== category);
			} else {
				return [...prev, category];
			}
		});
		setPage(1);
	};

	// Reset all filters
	const handleClearFilters = () => {
		setSelectedCategories([]);
		setPriceRange({ min: "", max: "" });
		setSortBy("relevance");
		setPage(1);
	};

	// Calculate total pages for pagination
	const totalPages = Math.ceil(totalResults / itemsPerPage);

	return (
		<div className="container mx-auto py-8 px-4">
			{/* Page header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
					<Icon icon="mdi:magnify" className="mr-2 text-primary" />
					Search Results for &quot;{searchQuery}&quot;
				</h1>
				<div className="text-gray-600">
					{isLoading ? (
						<Skeleton className="h-5 w-48" />
					) : (
						`Found ${totalResults} results for your search`
					)}
				</div>
			</div>

			{/* Mobile filter toggle */}
			<div className="lg:hidden mb-4">
				<Button
					variant="outline"
					className="w-full flex justify-between items-center"
					onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
					<span className="flex items-center">
						<Icon icon="mdi:filter-variant" className="mr-2" />
						Filters
					</span>
					<Icon
						icon={mobileFiltersOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
					/>
				</Button>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Filters sidebar - Desktop */}
				<div
					className={`w-full lg:w-1/4 ${
						mobileFiltersOpen ? "block" : "hidden lg:block"
					}`}>
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-4">
						<div className="flex items-center justify-between mb-4">
							<h2 className="font-medium text-lg">Filters</h2>
							{selectedCategories.length > 0 ||
							priceRange.min ||
							priceRange.max ? (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClearFilters}
									className="text-sm text-primary hover:text-primary/80">
									Clear all
								</Button>
							) : null}
						</div>

						{/* Categories filter */}
						<Accordion type="single" collapsible defaultValue="categories">
							<AccordionItem value="categories" className="border-b">
								<AccordionTrigger className="text-base py-3">
									Categories
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 pt-1">
										{categories.map((category) => (
											<div
												key={category}
												className="flex items-center space-x-2">
												<Checkbox
													id={`category-${category}`}
													checked={selectedCategories.includes(category)}
													onCheckedChange={() => handleCategoryToggle(category)}
												/>
												<label
													htmlFor={`category-${category}`}
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
													{category}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Price range filter */}
							<AccordionItem value="price" className="border-b">
								<AccordionTrigger className="text-base py-3">
									Price Range
								</AccordionTrigger>
								<AccordionContent>
									<form
										onSubmit={handlePriceRangeSubmit}
										className="space-y-3 pt-1">
										<div className="flex items-center space-x-2">
											<Input
												type="number"
												placeholder="Min"
												value={priceRange.min}
												onChange={(e) =>
													setPriceRange({ ...priceRange, min: e.target.value })
												}
												className="w-full"
											/>
											<span className="text-gray-500">-</span>
											<Input
												type="number"
												placeholder="Max"
												value={priceRange.max}
												onChange={(e) =>
													setPriceRange({ ...priceRange, max: e.target.value })
												}
												className="w-full"
											/>
										</div>
										<Button type="submit" className="w-full">
											Apply
										</Button>
									</form>
								</AccordionContent>
							</AccordionItem>

							{/* Rating filter */}
							<AccordionItem value="rating" className="border-b">
								<AccordionTrigger className="text-base py-3">
									Rating
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 pt-1">
										{[4, 3, 2, 1].map((rating) => (
											<div key={rating} className="flex items-center space-x-2">
												<Checkbox id={`rating-${rating}`} />
												<label
													htmlFor={`rating-${rating}`}
													className="text-sm font-medium leading-none flex items-center cursor-pointer">
													<div className="flex items-center mr-1">
														{Array(5)
															.fill()
															.map((_, i) => (
																<Icon
																	key={i}
																	icon={
																		i < rating ? "mdi:star" : "mdi:star-outline"
																	}
																	className={`w-4 h-4 ${
																		i < rating
																			? "text-yellow-400"
																			: "text-gray-300"
																	}`}
																/>
															))}
													</div>
													<span>& Up</span>
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>

				{/* Main content area */}
				<div className="w-full lg:w-3/4">
					{/* Sort and result count */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-gray-50 rounded-lg p-4">
						<div className="text-sm text-gray-600 mb-3 sm:mb-0">
							Showing{" "}
							{isLoading
								? "..."
								: `${(page - 1) * itemsPerPage + 1} - ${Math.min(
										page * itemsPerPage,
										totalResults,
								  )}`}{" "}
							of {isLoading ? "..." : totalResults} products
						</div>
						<div className="flex items-center">
							<label className="text-sm text-gray-600 mr-2">Sort by:</label>
							<Select
								value={sortBy}
								onValueChange={(value) => {
									setSortBy(value);
									setPage(1);
								}}>
								<SelectTrigger className="w-[280px]">
									<SelectValue placeholder="Relevance" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="relevance">Relevance</SelectItem>
									<SelectItem value="price_asc">Price: Low to High</SelectItem>
									<SelectItem value="price_desc">Price: High to Low</SelectItem>
									<SelectItem value="newest">Newest First</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Products grid */}
					{isLoading ? (
						// Skeleton loading state
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array(itemsPerPage)
								.fill()
								.map((_, index) => (
									<Card key={index} className="overflow-hidden">
										<div className="aspect-w-1 aspect-h-1">
											<Skeleton className="h-48 w-full" />
										</div>
										<CardHeader className="pb-2">
											<Skeleton className="h-4 w-3/4 mb-2" />
											<Skeleton className="h-4 w-1/2" />
										</CardHeader>
										<CardContent className="py-2">
											<Skeleton className="h-6 w-24 mb-2" />
											<Skeleton className="h-4 w-32" />
										</CardContent>
										<CardFooter className="pt-0">
											<Skeleton className="h-10 w-full" />
										</CardFooter>
									</Card>
								))}
						</div>
					) : searchResults.length === 0 ? (
						// Empty state
						<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
							<Icon
								icon="mdi:basket-off"
								className="w-16 h-16 mx-auto text-gray-300 mb-4"
							/>
							<h3 className="text-lg font-medium mb-2">No results found</h3>
							<p className="text-gray-600 mb-6">
								We couldn't find any products matching "{searchQuery}".
							</p>
							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<Button variant="outline" onClick={handleClearFilters}>
									Clear all filters
								</Button>
								<Link href="/products">
									<Button className="w-full">Browse all products</Button>
								</Link>
							</div>
						</div>
					) : (
						// Search results - using ProductCard component
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{paginatedResults.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					)}

					{/* Pagination */}
					{!isLoading && paginatedResults.length > 0 && totalPages > 1 && (
						<div className="flex justify-center mt-8">
							<div className="flex items-center gap-1">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8"
									onClick={() => setPage(Math.max(1, page - 1))}
									disabled={page === 1}>
									<Icon icon="mdi:chevron-left" className="h-4 w-4" />
								</Button>

								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter(
										(p) =>
											p === 1 ||
											p === totalPages ||
											(p >= page - 1 && p <= page + 1),
									)
									.map((p, i, arr) => (
										<div key={p} className="flex items-center">
											{i > 0 && arr[i - 1] !== p - 1 && (
												<span className="px-2 text-gray-400">...</span>
											)}
											<Button
												variant={p === page ? "default" : "outline"}
												size="sm"
												className="h-8 w-8"
												onClick={() => setPage(p)}>
												{p}
											</Button>
										</div>
									))}

								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8"
									onClick={() => setPage(Math.min(totalPages, page + 1))}
									disabled={page === totalPages}>
									<Icon icon="mdi:chevron-right" className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
