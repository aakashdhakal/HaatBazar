import ProductCard from "@/components/ProductCard";
import { auth } from "@/app/auth";
import getAllProducts from "@/app/(server)/actions/products";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const products = await getAllProducts();
	let session = await auth();

	// Get featured products (deals)
	const featuredProducts = products.slice(0, 4);
	// Get fresh arrivals
	const freshArrivals = products.slice(4, 10);

	// Get category-specific products
	const vegetables = products
		.filter((product) => product.category?.toLowerCase() === "vegetables")
		.slice(0, 4);
	const fruits = products
		.filter((product) => product.category?.toLowerCase() === "fruits")
		.slice(0, 4);

	// Get highest rated products
	const bestSellers = [...products]
		.sort((a, b) => (b.rating || 0) - (a.rating || 0))
		.slice(0, 4);

	// Grocery categories - using the existing ones
	const categories = [
		{
			name: "Vegetables",
			icon: "mdi:carrot",
			color: "bg-primary/10 text-primary",
		},
		{
			name: "Fruits",
			icon: "game-icons:fruit-bowl",
			color: "bg-secondary/10 text-secondary",
		},
		{
			name: "Dairy",
			icon: "tdesign:milk-filled",
			color: "bg-primary/10 text-primary",
		},
		{
			name: "Bakery",
			icon: "mdi:bread-slice",
			color: "bg-secondary/10 text-secondary",
		},
		{
			name: "Beverages",
			icon: "mdi:cup",
			color: "bg-primary/10 text-primary",
		},
		{
			name: "Snacks",
			icon: "mdi:food-apple",
			color: "bg-secondary/10 text-secondary",
		},
		{
			name: "Pantry",
			icon: "mdi:spice",
			color: "bg-primary/10 text-primary",
		},
		{
			name: "Meat & Seafood",
			icon: "mdi:fish",
			color: "bg-secondary/10 text-secondary",
		},
	];

	return (
		<main className="min-h-screen bg-gray-50 container mx-auto">
			{/* Hero Section with Search */}
			<section className="bg-white rounded-lg overflow-hidden">
				<div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl overflow-hidden">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/2 p-8 md:p-12 flex flex-col gap-4">
							<span className="inline-block text-primary font-medium">
								HaatBazar Groceries
							</span>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
								Fresh Groceries Delivered to Your Door
							</h1>

							<p className="text-gray-600">
								Order fresh vegetables, fruits, and daily essentials with quick
								delivery in under 30 minutes.
							</p>
							<div className="flex flex-wrap gap-3">
								<Link
									href="/products"
									className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
									Shop Now
									<Icon icon="mdi:arrow-right" className="w-4 h-4" />
								</Link>
								<Link
									href="/offers"
									className="px-5 py-2.5 border border-secondary/50 text-secondary rounded-md hover:bg-secondary/5 transition-colors">
									View Offers
								</Link>
							</div>
						</div>
						<div className="md:w-1/2 relative p-4 md:p-0">
							<div className="h-64 md:h-80">
								<Image
									src="https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="Fresh vegetables and fruits"
									fill
									className="object-cover rounded-lg"
									priority
								/>
							</div>
							<div className="absolute bottom-8 right-8 bg-white p-3 rounded-lg shadow-lg">
								<div className="flex items-center gap-2">
									<Icon
										icon="mdi:clock-fast"
										className="w-5 h-5 text-secondary"
									/>
									<p className="font-semibold">Delivery in 30 min</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories - Prominently placed for better ecommerce navigation */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-gray-900">
							Shop by Category
						</h2>
						<Link
							href="/categories"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
						{categories.map((category) => (
							<Link
								key={category.name}
								href={`/category/${category.name.toLowerCase()}`}>
								<div className="flex flex-col items-center p-2 rounded-lg hover:shadow-md transition-all bg-white border border-gray-100 hover:border-primary/20">
									<div
										className={`w-10 h-10 md:w-12 md:h-12 ${category.color} rounded-full flex items-center justify-center mb-1`}>
										<Icon
											icon={category.icon}
											className="w-5 h-5 md:w-6 md:h-6"
										/>
									</div>
									<span className="font-medium text-xs md:text-sm text-center">
										{category.name}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Quick Offers Banner */}
			<section className="py-3 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 flex items-center gap-3">
						<Icon icon="mdi:timer-sand" className="w-6 h-6 text-secondary" />
						<div>
							<span className="font-medium text-secondary-dark">
								Limited Time Offers
							</span>
							<p className="text-sm text-gray-600">
								Use code FRESH15 for 15% off on your first order
							</p>
						</div>
						<Link
							href="/offers"
							className="ml-auto bg-secondary text-white px-3 py-1.5 rounded-md text-sm hover:bg-secondary/90 transition-colors whitespace-nowrap">
							Shop Offers
						</Link>
					</div>
				</div>
			</section>

			{/* Today's Deals */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-gray-900">
							Today&apos;s Deals
						</h2>
						<Link
							href="/deals"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{featuredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Category Products - Vegetables (New ecommerce-focused section) */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<div className="bg-primary/10 p-2 rounded-full">
								<Icon icon="mdi:carrot" className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-bold text-gray-900">
								Fresh Vegetables
							</h2>
						</div>
						<Link
							href="/category/vegetables"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{vegetables.length > 0
							? vegetables.map((product) => (
									<ProductCard key={product._id} product={product} />
							  ))
							: featuredProducts
									.slice(0, 4)
									.map((product) => (
										<ProductCard key={product._id} product={product} />
									))}
					</div>
				</div>
			</section>

			{/* Category Products - Fruits (New ecommerce-focused section) */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<div className="bg-secondary/10 p-2 rounded-full">
								<Icon
									icon="game-icons:fruit-bowl"
									className="w-5 h-5 text-secondary"
								/>
							</div>
							<h2 className="text-xl font-bold text-gray-900">Fresh Fruits</h2>
						</div>
						<Link
							href="/category/fruits"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{fruits.length > 0
							? fruits.map((product) => (
									<ProductCard key={product._id} product={product} />
							  ))
							: freshArrivals
									.slice(0, 4)
									.map((product) => (
										<ProductCard key={product._id} product={product} />
									))}
					</div>
				</div>
			</section>

			{/* Best Sellers - New ecommerce-focused section */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<div className="bg-primary/10 p-2 rounded-full">
								<Icon icon="mdi:star" className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-bold text-gray-900">Best Sellers</h2>
						</div>
						<Link
							href="/best-sellers"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{bestSellers.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Fresh Arrivals */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
						<Link
							href="/fresh"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{freshArrivals.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Features - Same as original but with added "Shop Now" links */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg hover:border-primary/20 transition-colors">
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 p-2 rounded-full">
									<Icon
										icon="mdi:truck-fast-outline"
										className="w-5 h-5 text-primary"
									/>
								</div>
								<div>
									<h3 className="font-medium text-sm">Express Delivery</h3>
									<p className="text-gray-500 text-xs">In under 30 minutes</p>
								</div>
							</div>
							<Link
								href="/products"
								className="text-primary text-xs font-medium hover:underline mt-auto">
								Shop Now
							</Link>
						</div>
						<div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg hover:border-secondary/20 transition-colors">
							<div className="flex items-center gap-3">
								<div className="bg-secondary/10 p-2 rounded-full">
									<Icon icon="mdi:leaf" className="w-5 h-5 text-secondary" />
								</div>
								<div>
									<h3 className="font-medium text-sm">Fresh Produce</h3>
									<p className="text-gray-500 text-xs">Farm to table quality</p>
								</div>
							</div>
							<Link
								href="/category/vegetables"
								className="text-secondary text-xs font-medium hover:underline mt-auto">
								Shop Vegetables
							</Link>
						</div>
						<div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg hover:border-primary/20 transition-colors">
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 p-2 rounded-full">
									<Icon
										icon="mdi:tag-multiple"
										className="w-5 h-5 text-primary"
									/>
								</div>
								<div>
									<h3 className="font-medium text-sm">Best Prices</h3>
									<p className="text-gray-500 text-xs">Wholesale rates daily</p>
								</div>
							</div>
							<Link
								href="/deals"
								className="text-primary text-xs font-medium hover:underline mt-auto">
								View Deals
							</Link>
						</div>
						<div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg hover:border-secondary/20 transition-colors">
							<div className="flex items-center gap-3">
								<div className="bg-secondary/10 p-2 rounded-full">
									<Icon
										icon="mdi:cash-refund"
										className="w-5 h-5 text-secondary"
									/>
								</div>
								<div>
									<h3 className="font-medium text-sm">Easy Returns</h3>
									<p className="text-gray-500 text-xs">No questions asked</p>
								</div>
							</div>
							<Link
								href="/customer-service"
								className="text-secondary text-xs font-medium hover:underline mt-auto">
								Learn More
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Download App Section - Condensed with more shopping focus */}
			<section className="py-6 bg-white mt-4 mb-6 rounded-lg">
				<div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="mb-4 md:mb-0">
							<h2 className="text-xl font-bold mb-2">Download Our App</h2>
							<p className="text-gray-600 mb-4 max-w-md">
								Get exclusive offers and track your orders in real-time
							</p>
							<div className="flex gap-3">
								<Link
									href="#"
									className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded">
									<Icon icon="mdi:apple" className="w-5 h-5" />
									<span>App Store</span>
								</Link>
								<Link
									href="#"
									className="flex items-center gap-2 bg-secondary text-white py-2 px-4 rounded">
									<Icon icon="mdi:google-play" className="w-5 h-5" />
									<span>Google Play</span>
								</Link>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="text-center">
								<div className="bg-white p-3 rounded-full shadow-sm mb-2">
									<Icon
										icon="mdi:phone-check"
										className="w-6 h-6 text-primary"
									/>
								</div>
								<p className="text-sm font-medium">Quick Ordering</p>
							</div>

							<div className="text-center">
								<div className="bg-white p-3 rounded-full shadow-sm mb-2">
									<Icon
										icon="mdi:map-marker"
										className="w-6 h-6 text-secondary"
									/>
								</div>
								<p className="text-sm font-medium">Order Tracking</p>
							</div>

							<div className="text-center">
								<div className="bg-white p-3 rounded-full shadow-sm mb-2">
									<Icon
										icon="mdi:ticket-percent"
										className="w-6 h-6 text-primary"
									/>
								</div>
								<p className="text-sm font-medium">Exclusive Deals</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
