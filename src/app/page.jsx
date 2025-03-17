import ProductCard from "@/components/ProductCard";
import { auth } from "@/app/auth";
import getAllProducts from "@/app/server/actions/products";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default async function Home() {
	const products = await getAllProducts();
	let session = await auth();

	// Get featured products
	const featuredProducts = products.slice(0, 4);
	// Get fresh arrivals
	const freshArrivals = products.slice(4, 10);

	// Grocery categories
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
	];

	return (
		<main className="min-h-screen bg-gray-50 container mx-auto">
			{/* Hero Section */}
			<section className="bg-white">
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

			{/* Categories */}
			<section className="py-8 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-bold text-gray-900">
							Shop by Category
						</h2>
						<Link
							href="/categories"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
						{categories.map((category) => (
							<Link
								key={category.name}
								href={`/category/${category.name.toLowerCase()}`}>
								<div className="flex flex-col items-center p-3 rounded-lg hover:shadow-md transition-all bg-white border border-gray-100 hover:border-primary/20">
									<div
										className={`w-12 h-12 md:w-14 md:h-14 ${category.color} rounded-full flex items-center justify-center mb-2`}>
										<Icon
											icon={category.icon}
											className="w-6 h-6 md:w-7 md:h-7"
										/>
									</div>
									<span className="font-medium text-sm md:text-base text-center">
										{category.name}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Quick Offers Banner */}
			<section className="py-4 bg-white mt-4 rounded-lg">
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
					</div>
				</div>
			</section>

			{/* Today's Deals */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-5">
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

			{/* Fresh Arrivals */}
			<section className="py-6 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-bold text-gray-900">Fresh Arrivals</h2>
						<Link
							href="/fresh"
							className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
							View All <Icon icon="mdi:chevron-right" className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{freshArrivals.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="py-8 bg-white mt-4 rounded-lg">
				<div className="">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-primary/20 transition-colors">
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
						<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-secondary/20 transition-colors">
							<div className="bg-secondary/10 p-2 rounded-full">
								<Icon icon="mdi:leaf" className="w-5 h-5 text-secondary" />
							</div>
							<div>
								<h3 className="font-medium text-sm">Fresh Produce</h3>
								<p className="text-gray-500 text-xs">Farm to table quality</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-primary/20 transition-colors">
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
						<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-secondary/20 transition-colors">
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
					</div>
				</div>
			</section>

			{/* Download App Section */}
			<section className="py-8 bg-white mt-4 mb-8 rounded-lg">
				<div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 flex flex-col items-center justify-center">
					<h2 className="text-xl font-bold mb-2">Download the HaatBazar App</h2>
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
			</section>
		</main>
	);
}
