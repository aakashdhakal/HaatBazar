import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100">
			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
					{/* Brand Column */}
					<div className="md:col-span-3 space-y-4">
						<Link href="/" className="flex items-center justify-center">
							<Image
								src="/logoWithText.png"
								alt="HAATBAZAR Logo"
								width={100}
								height={100}
							/>
						</Link>
						<p className="text-sm text-gray-600">
							Fresh vegetables, fruits and groceries delivered to your doorstep.
						</p>
						<div className="flex space-x-3 pt-2">
							<a href="#" className="text-gray-600 hover:text-primary">
								<Icon icon="mdi:facebook" className="w-5 h-5" />
							</a>
							<a href="#" className="text-gray-600 hover:text-primary">
								<Icon icon="mdi:instagram" className="w-5 h-5" />
							</a>
							<a href="#" className="text-gray-600 hover:text-primary">
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
									href="/vegetables"
									className="text-gray-600 hover:text-primary">
									Vegetables
								</Link>
							</li>
							<li>
								<Link
									href="/fruits"
									className="text-gray-600 hover:text-primary">
									Fruits
								</Link>
							</li>
							<li>
								<Link
									href="/dairy"
									className="text-gray-600 hover:text-primary">
									Dairy
								</Link>
							</li>
							<li>
								<Link
									href="/offers"
									className="text-gray-600 hover:text-secondary">
									Offers
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div className="md:col-span-2">
						<h3 className="font-medium mb-4">Customer Service</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/help" className="text-gray-600 hover:text-primary">
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="/orders/track"
									className="text-gray-600 hover:text-primary">
									Track Order
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="text-gray-600 hover:text-primary">
									Returns & Refunds
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-600 hover:text-primary">
									Contact Us
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
									href="/about"
									className="text-gray-600 hover:text-primary">
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-gray-600 hover:text-primary">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-gray-600 hover:text-primary">
									Terms & Conditions
								</Link>
							</li>
							<li>
								<Link href="/faq" className="text-gray-600 hover:text-primary">
									FAQs
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="md:col-span-3">
						<h3 className="font-medium mb-4">Newsletter</h3>
						<p className="text-sm text-gray-600 mb-3">
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
				<div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div className="flex items-center">
						<p className="text-sm text-gray-500 mr-4">Payment Methods:</p>
						<div className="flex space-x-3">
							<Image src="/esewa.png" alt="esewa" width={40} height={20} />
							<Image src="/khalti.png" alt="khalti" width={40} height={20} />
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-500">Get Our App:</span>
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
			<div className="bg-gray-50 py-4">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
					<p className="text-xs text-gray-500">
						&copy; {new Date().getFullYear()} HAATBAZAR. All rights reserved.
					</p>
					<div className="flex space-x-4 mt-2 md:mt-0">
						<Link
							href="/sitemap"
							className="text-xs text-gray-500 hover:text-primary">
							Sitemap
						</Link>
						<Link
							href="/accessibility"
							className="text-xs text-gray-500 hover:text-primary">
							Accessibility
						</Link>
						<Link
							href="/cookies"
							className="text-xs text-gray-500 hover:text-primary">
							Cookie Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
