"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useCallback } from "react";

// UI Components
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import AlertDialogComponent from "./AlertDialog";
import UserAvatar from "./UserAvatar";
import DropDown from "./DropDown";
import { ThemeToggle } from "./ThemeToggle";

// Actions and Context
import { getCart } from "@/app/(server)/actions/cart";
import { getNoOfWishListItems } from "@/app/(server)/actions/wishList";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { getCurrentUser } from "@/app/(server)/actions/users";

// --- Search Suggestions Dropdown ---

export function NavBar() {
	const { data: session, status } = useSession();
	const { cartItems, setCartItems } = useCart({});
	const { wishListItemsCount, setWishListItemsCount } = useWishList();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user, setUser] = useState(null);

	// --- Search Dropdown State ---
	const [searchValue, setSearchValue] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [loadingResults, setLoadingResults] = useState(false);
	const inputRef = useRef(null);

	// Debounce search
	const debounce = (func, delay) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};

	const fetchResults = useCallback(
		debounce(async (query) => {
			if (!query) {
				setSearchResults([]);
				return;
			}
			setLoadingResults(true);
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
				if (res.ok) {
					const data = await res.json();
					setSearchResults(data.results || []);
				} else {
					setSearchResults([]);
				}
			} catch {
				setSearchResults([]);
			}
			setLoadingResults(false);
		}, 300),
		[],
	);

	useEffect(() => {
		if (searchValue.trim()) {
			fetchResults(searchValue.trim());
		} else {
			setSearchResults([]);
		}
	}, [searchValue, fetchResults]);

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

	// Debug: log search results
	useEffect(() => {
		if (searchResults) {
			console.log("Search Results:", searchResults);
		}
	}, [searchResults]);

	return (
		<header
			className={`sticky top-0 z-40 w-full transition-all duration-300 ${
				isScrolled ? "shadow-md bg-background" : "bg-background"
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
						className="text-sm font-medium text-foreground hover:text-primary transition-colors">
						Vegetables
					</Link>
					<Link
						href="/category/fruits"
						className="text-sm font-medium text-foreground hover:text-primary transition-colors">
						Fruits
					</Link>
					<Link
						href="/category/dairy"
						className="text-sm font-medium text-foreground hover:text-primary transition-colors">
						Dairy
					</Link>
					<Link
						href="/products"
						className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors">
						All Products
					</Link>
				</div>

				{/* Search Bar - Redesigned */}
				<form
					className="relative flex w-[25vw] items-center focus-within:border-primary focus-within:ring-primary focus-within:ring-1 focus-within:ring-opacity-50 rounded-md pl-2 border border-border overflow-hidden"
					onSubmit={(e) => {
						e.preventDefault();
						if (searchValue && searchValue.trim()) {
							window.location.href = `/search/${encodeURIComponent(
								searchValue.trim(),
							)}`;
						}
					}}>
					<Input
						type="text"
						name="query"
						ref={inputRef}
						value={searchValue}
						onChange={(e) => {
							setSearchValue(e.target.value);
							setShowDropdown(true);
						}}
						onFocus={() => setShowDropdown(true)}
						onBlur={() => setTimeout(() => setShowDropdown(false), 300)} // Increased timeout
						placeholder="Search products..."
						className="w-full py-2 bg-muted border-none outline-none ring-0 rounded-md text-sm 
												focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none transition-colors"
					/>
					<Button
						variant="ghost"
						className="h-7 w-7 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-none"
						type="submit">
						<Icon icon="mdi:magnify" className="h-4 w-4" />
					</Button>
					{/* Dropdown for search results */}
					{showDropdown && (searchResults.length > 0 || loadingResults) && (
						<ul
							className="absolute left-0 top-full z-50 mt-1 w-full bg-white dark:bg-background border border-border rounded-md shadow-lg max-h-56 overflow-auto"
							onMouseDown={(e) => e.preventDefault()} // Prevent dropdown from closing on click
						>
							{loadingResults && (
								<li className="px-4 py-2 text-sm text-muted-foreground">
									Searching...
								</li>
							)}
							{searchResults.map((item) => (
								<li
									key={item.id || item._id || item.slug || item.name}
									className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-sm text-foreground"
									onMouseDown={() => {
										setSearchValue(item.name || item.title || item.slug);
										setShowDropdown(false);
										window.location.href = `/product/${
											item.slug || item.id || item._id
										}`;
									}}>
									{item.name || item.title}
								</li>
							))}
							{!loadingResults &&
								searchResults.length === 0 &&
								searchValue.trim() && (
									<li className="px-4 py-2 text-sm text-muted-foreground">
										No results found
									</li>
								)}
						</ul>
					)}
				</form>

				{/* Action Buttons - Updated with brand colors */}
				<div className="flex items-center gap-4">
					{/* Search button (mobile only) */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden hover:bg-primary/5">
						<Icon icon="mdi:magnify" className="h-5 w-5 text-foreground" />
					</Button>

					{/* Wishlist */}
					<div className="relative">
						<Link href="/wishlist" className="p-2 block">
							<Icon
								icon="mdi:heart-outline"
								className="h-6 w-6 text-foreground hover:text-primary transition-colors"
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
								className="h-6 w-6 text-foreground hover:text-primary transition-colors"
							/>
							{cartItems.length > 0 && (
								<span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
									{cartItems.length}
								</span>
							)}
						</Link>
					</div>

					{/* Dark/Light mode toggle button */}
					<ThemeToggle className="hover:bg-primary/10" />

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
												className="text-sm font-medium flex items-center gap-2 text-foreground ">
												<Icon icon="mdi:shield-account" className="h-4 w-4" />
												<span>Dashboard</span>
											</Link>,
									  ]
									: []),
								<Link
									key="profile"
									href="/newUser"
									className="text-sm font-medium flex items-center gap-2 text-foreground ">
									<Icon icon="mdi:account" className="h-4 w-4" />
									<span>Profile</span>
								</Link>,
								<Link
									key="orders"
									href="/orders"
									className="text-sm font-medium flex items-center gap-2 text-foreground ">
									<Icon icon="mdi:package" className="h-4 w-4" />
									<span>Orders</span>
								</Link>,
								<Link
									key="wishlist"
									href="/wishlist"
									className="text-sm font-medium flex items-center gap-2 text-foreground text-center ">
									<Icon icon="mdi:heart" className="h-4 w-4" />
									<span>Wishlist</span>
								</Link>,

								<AlertDialogComponent
									varient="dropdown"
									size="dropdown"
									key="logout"
									triggerClassname="text-sm font-medium flex items-center justify-start gap-2 text-foreground hover:text- transition-colors hover:bg-destructive/20"
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
							className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 hover:bg-background px-4 py-1.5 text-sm font-medium hover:text-primary bg-primary  transition-colors duration-200 text-white">
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
							className="h-5 w-5 text-foreground"
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
						className="w-full py-1.5 pl-3 pr-10 border border-border focus:border-primary focus:ring-primary rounded-md text-sm"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-primary">
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
						href="/category/vegetables"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon icon="mdi:carrot" className="mr-2 h-5 w-5 text-primary/70" />
						Vegetables
					</Link>
					<Link
						href="/category/fruits"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon
							icon="mdi:food-apple"
							className="mr-2 h-5 w-5 text-primary/70"
						/>
						Fruits
					</Link>
					<Link
						href="/category/dairy"
						className="flex items-center py-2.5 text-sm text-gray-700 hover:text-primary">
						<Icon
							icon="mdi:bottle-tonic"
							className="mr-2 h-5 w-5 text-primary/70"
						/>
						Dairy
					</Link>
					<Link
						href="/products"
						className="flex items-center py-2.5 text-sm text-secondary hover:text-secondary-dark">
						<Icon
							icon="mdi:tag-outline"
							className="mr-2 h-5 w-5 text-secondary/70"
						/>
						All Products
					</Link>
				</div>
			</div>
		</header>
	);
}
