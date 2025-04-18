"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

// UI Components
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import AlertDialogComponent from "./AlertDialog";
import UserAvatar from "./UserAvatar";
import DropDown from "./DropDown";

// Actions and Context
import { getCart } from "@/app/(server)/actions/cart";
import { getNoOfWishListItems } from "@/app/(server)/actions/wishList";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import Form from "next/form";
import { getCurrentUser } from "@/app/(server)/actions/users";

export function NavBar() {
	const { data: session, status } = useSession();
	const { cartItems, setCartItems } = useCart({});
	const { wishListItemsCount, setWishListItemsCount } = useWishList();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user, setUser] = useState(null);

	// Add this effect to fetch the database user
	useEffect(() => {
		const fetchUser = async () => {
			if (status === "authenticated") {
				const userData = await getCurrentUser();
				console.log("User data:", userData);
				if (userData) {
					setUser(userData);
				}
			}
		};
		fetchUser();
	}, [status]);

	// Handle cart and wishlist items
	useEffect(() => {
		const fetchCartItemsCount = async () => {
			setCartItems(await getCart());
		};
		const fetchWishListItemsCount = async () => {
			setWishListItemsCount(await getNoOfWishListItems());
		};
		fetchCartItemsCount();
		fetchWishListItemsCount();
	}, [setCartItems, setWishListItemsCount]);

	// Add scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`sticky top-0 z-40 w-full transition-all duration-300 ${
				isScrolled ? "shadow-md bg-white" : "bg-white"
			}`}>
			{/* Top bar - Updated with brand colors */}
			<div className="bg-primary/10 py-1.5 text-center text-xs font-medium text-primary">
				<span>Free delivery on orders above Rs 500</span>
			</div>

			<nav className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<div className="flex items-center w-[180px]">
					<Link href="/" className="flex items-center">
						<Image
							src="/logo.svg"
							alt="HAATBAZAAR Logo"
							width={32}
							height={32}
							className="mr-2"
						/>
					</Link>
				</div>

				{/* Desktop Navigation - Updated with brand colors */}
				<div className="hidden md:flex items-center space-x-6">
					<Link
						href="/category/vegetables"
						className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
						Vegetables
					</Link>
					<Link
						href="/category/fruits"
						className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
						Fruits
					</Link>
					<Link
						href="/category/dairy"
						className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
						Dairy
					</Link>
					<Link
						href="/offers"
						className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors">
						Offers
					</Link>
				</div>

				{/* Search Bar - Redesigned */}
				<Form
					className="relative flex w-[25vw] items-center focus-within:border-primary focus-within:ring-primary focus-within:ring-1 focus-within:ring-opacity-50 rounded-md pl-2 border border-gray-300 overflow-hidden"
					action={`/search`}>
					<Input
						type="text"
						placeholder="Search products..."
						className="w-full py-2 bg-gray-50 border-none outline-none ring-0 rounded-md text-sm 
											focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none transition-colors"
					/>
					<Button
						variant="ghost"
						className="h-7 w-7bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-none"
						type="submit">
						<Icon icon="mdi:magnify" className="h-4 w-4" />
					</Button>
				</Form>

				{/* Action Buttons - Updated with brand colors */}
				<div className="flex items-center gap-4">
					{/* Search button (mobile only) */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden hover:bg-primary/5">
						<Icon icon="mdi:magnify" className="h-5 w-5 text-gray-700" />
					</Button>

					{/* Wishlist */}
					<div className="relative">
						<Link href="/wishlist" className="p-2 block">
							<Icon
								icon="mdi:heart-outline"
								className="h-6 w-6 text-gray-700 hover:text-primary transition-colors"
							/>
							{wishListItemsCount > 0 && (
								<span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
									{wishListItemsCount}
								</span>
							)}
						</Link>
					</div>

					{/* Cart */}
					<div className="relative">
						<Link href="/cart" className="p-2 block">
							<Icon
								icon="mdi:cart-outline"
								className="h-6 w-6 text-gray-700 hover:text-primary transition-colors"
							/>
							{cartItems.length > 0 && (
								<span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
									{cartItems.length}
								</span>
							)}
						</Link>
					</div>

					{/* User Menu */}
					{status === "loading" ? (
						<Skeleton className="w-8 h-8 rounded-full" />
					) : status === "authenticated" ? (
						<DropDown
							trigger={
								<UserAvatar
									src={user?.image}
									className="border border-primary"
								/>
							}
							label={user?.name}
							items={[
								...(user?.role === "admin"
									? [
											<Link
												key="admin"
												href="/dashboard"
												className="text-sm font-medium flex items-center gap-2 text-gray-700 ">
												<Icon icon="mdi:shield-account" className="h-4 w-4" />
												<span>Dashboard</span>
											</Link>,
									  ]
									: []),
								<Link
									key="profile"
									href="/profile"
									className="text-sm font-medium flex items-center gap-2 text-gray-700 ">
									<Icon icon="mdi:account" className="h-4 w-4" />
									<span>Profile</span>
								</Link>,
								<Link
									key="orders"
									href="/orders"
									className="text-sm font-medium flex items-center gap-2 text-gray-700 ">
									<Icon icon="mdi:package" className="h-4 w-4" />
									<span>Orders</span>
								</Link>,
								<Link
									key="settings"
									href="/settings"
									className="text-sm font-medium flex items-center gap-2 text-gray-700 text-center ">
									<Icon icon="mdi:cog" className="h-4 w-4" />
									<span>Settings</span>
								</Link>,

								<AlertDialogComponent
									varient="dropdown"
									size="dropdown"
									key="logout"
									triggerClassname="text-sm font-medium flex items-center justify-start gap-2 text-gray-700 hover:text- transition-colors hover:bg-destructive/20"
									triggerText={
										<span className="text-sm font-medium flex items-center gap-2">
											<Icon icon="mdi:logout" />
											<span>Logout</span>
										</span>
									}
									alertTitle="Are you sure you want to logout?"
									alertDescription="You will be logged out of your account"
									cancelText="Cancel"
									actionText="Logout"
									action={() => signOut({ callbackUrl: "/" })}
								/>,
							]}
						/>
					) : (
						<Link
							href="/login"
							className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-white px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-200">
							<span>LOGIN</span>
						</Link>
					)}

					{/* Mobile menu button */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden hover:bg-primary/5"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Menu">
						<Icon
							icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"}
							className="h-5 w-5 text-gray-700"
						/>
					</Button>
				</div>
			</nav>

			{/* Mobile Search - Updated with brand colors */}
			<div
				className={`md:hidden px-4 pb-3 ${
					isMobileMenuOpen ? "block" : "hidden"
				}`}>
				<div className="relative w-full">
					<Input
						type="text"
						placeholder="Search products..."
						className="w-full py-1.5 pl-3 pr-10 border border-gray-200 focus:border-primary focus:ring-primary rounded-md text-sm"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-primary">
						<Icon icon="mdi:magnify" className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Mobile menu - Updated with brand colors */}
			<div
				className={`md:hidden pb-3 border-t border-gray-100 ${
					isMobileMenuOpen ? "block" : "hidden"
				}`}>
				<div className="px-4 py-2 divide-y divide-gray-100">
					<Link
						href="/vegetables"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon icon="mdi:carrot" className="mr-2 h-5 w-5 text-primary/70" />
						Vegetables
					</Link>
					<Link
						href="/fruits"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon
							icon="mdi:food-apple"
							className="mr-2 h-5 w-5 text-primary/70"
						/>
						Fruits
					</Link>
					<Link
						href="/dairy"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon
							icon="mdi:bottle-tonic"
							className="mr-2 h-5 w-5 text-primary/70"
						/>
						Dairy
					</Link>
					<Link
						href="/offers"
						className="flex items-center py-2.5 text-sm text-secondary hover:text-secondary-dark">
						<Icon
							icon="mdi:tag-outline"
							className="mr-2 h-5 w-5 text-secondary/70"
						/>
						Offers
					</Link>
				</div>
			</div>
		</header>
	);
}
