import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
	return (
		<footer className="bg-background border-t border-border">
			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
					{/* Brand Column */}
					<div className="md:col-span-3 space-y-4">
						<Link href="/" className="flex items-center justify-center">
							<Image
								src="/logoSideText.png"
								alt="HAATBAZAR Logo"
								width={150}
								height={100}
							/>
						</Link>
						<p className="text-sm text-muted-foreground">
							Fresh vegetables, fruits and groceries delivered to your doorstep.
						</p>
						<div className="flex space-x-3 pt-2">
							<a href="#" className="text-muted-foreground hover:text-primary">
								<Icon icon="mdi:facebook" className="w-5 h-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary">
								<Icon icon="mdi:instagram" className="w-5 h-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary">
								<Icon icon="mdi:twitter" className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div className="md:col-span-2">
						<h3 className="font-medium mb-4">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/category/vegetables"
									className="text-muted-foreground hover:text-primary">
									Vegetables
								</Link>
							</li>
							<li>
								<Link
									href="/category/fruits"
									className="text-muted-foreground hover:text-primary">
									Fruits
								</Link>
							</li>
							<li>
								<Link
									href="/category/dairy"
									className="text-muted-foreground hover:text-primary">
									Dairy
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-muted-foreground hover:text-secondary">
									All Products
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div className="md:col-span-2">
						<h3 className="font-medium mb-4">Customer Service</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/orders"
									className="text-muted-foreground hover:text-primary">
									My Orders
								</Link>
							</li>
							<li>
								<Link
									href="/orders"
									className="text-muted-foreground hover:text-primary">
									Track Order
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-muted-foreground hover:text-primary">
									My Cart
								</Link>
							</li>
							<li>
								<Link
									href="/wishlist"
									className="text-muted-foreground hover:text-primary">
									Wishlist
								</Link>
							</li>
						</ul>
					</div>

					{/* Information */}
					<div className="md:col-span-2">
						<h3 className="font-medium mb-4">Information</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/"
									className="text-muted-foreground hover:text-primary">
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-muted-foreground hover:text-primary">
									Shop All
								</Link>
							</li>
							<li>
								<Link
									href="/login"
									className="text-muted-foreground hover:text-primary">
									Login
								</Link>
							</li>
							<li>
								<Link
									href="/signup"
									className="text-muted-foreground hover:text-primary">
									Sign Up
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="md:col-span-3">
						<h3 className="font-medium mb-4">Newsletter</h3>
						<p className="text-sm text-muted-foreground mb-3">
							Subscribe to get updates on new products and offers.
						</p>
						<div className="flex space-x-2">
							<Input
								type="email"
								placeholder="Your email"
								className="text-sm rounded-md"
							/>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary-dark text-white">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				{/* Payment & App */}
				<div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div className="flex items-center">
						<p className="text-sm text-muted-foreground mr-4">
							Payment Methods:
						</p>
						<div className="flex space-x-3">
							<Image src="/esewa.png" alt="esewa" width={40} height={20} />
							<Image src="/khalti.png" alt="khalti" width={40} height={20} />
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<span className="text-sm text-muted-foreground">Get Our App:</span>
						<Link
							href="#"
							className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded">
							<Icon icon="mdi:apple" className="w-4 h-4" />
							<span>App Store</span>
						</Link>
						<Link
							href="#"
							className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1.5 rounded">
							<Icon icon="mdi:google-play" className="w-4 h-4" />
							<span>Play Store</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Copyright Bar */}
			<div className="bg-muted py-4">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} HAATBAZAR. All rights reserved.
					</p>
					<div className="flex space-x-4 mt-2 md:mt-0">
						<Link
							href="/products"
							className="text-xs text-muted-foreground hover:text-primary">
							Products
						</Link>
						<Link
							href="/cart"
							className="text-xs text-muted-foreground hover:text-primary">
							Cart
						</Link>
						<Link
							href="/orders"
							className="text-xs text-muted-foreground hover:text-primary">
							Orders
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
