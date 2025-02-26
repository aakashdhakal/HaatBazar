"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AlertDialogComponent from "./AlertDialog";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import UserAvatar from "./UserAvatar";
import DropDown from "./DropDown";
import { Skeleton } from "./ui/skeleton";
import { Icon } from "@iconify-icon/react";
import { getCart } from "../actions/cart";
import { getNoOfWishListItems } from "../actions/wishList";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Input } from "./ui/input";

export function NavBar() {
	const { data: session, status } = useSession();
	const { cartItems, setCartItems } = useCart({});
	const { wishListItemsCount, setWishListItemsCount } = useWishList();

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

	return (
		<nav className="bg-white flex justify-between items-center border-b-2 border-gray-200 p-4 container mx-auto ">
			<Link href="/" className="text-2xl font-semibold">
				HAATBAZAAR
			</Link>
			{/* <NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/products" className="text-base">
								Products
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/categories" className="text-base">
								Categories
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/about" className="text-base">
								About Us
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/contact" className="text-base">
								Contact Us
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}>
							<Link href="/faq" className="text-base">
								FAQ
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu> */}
			{/* search bar */}
			<div className="flex items-center gap-4 border border-gray-400 rounded-lg w-[40%] focus-within:ring-1 focus-within:ring-black">
				<Input
					type="text"
					placeholder="Search for products..."
					className="border-none outline-none bg-gray-100 p-2 rounded-lg focus-visible:ring-transparent w-full"
				/>
				<Button variant="ghost" size="icon">
					<Icon
						icon="mdi:magnify"
						width="1.5rem"
						height="1.5rem"
						className="text-gray-400 w-max"
					/>
				</Button>
			</div>
			<div className="flex items-center gap-6">
				<Button variant="ghost" size="icon" badge={wishListItemsCount}>
					<Icon icon="iconamoon:heart-light" width="1.7rem" height="1.7rem" />
				</Button>
				<Button variant="ghost" size="icon" badge={cartItems.length || ""}>
					<Link href="/cart">
						<Icon
							icon="solar:cart-large-outline"
							width="1.7rem"
							height="1.7rem"
						/>
					</Link>
				</Button>
				{status === "loading" ? (
					<Skeleton className="w-8 h-8 rounded-full" />
				) : status === "authenticated" ? (
					<DropDown
						trigger={<UserAvatar src={session.user.profilePic} />}
						label={session.user.name}
						items={[
							<Link
								key="profile"
								href="/profile"
								className="text-sm font-medium">
								Profile
							</Link>,
							<Link key="orders" href="/orders" className="text-sm font-medium">
								Orders
							</Link>,
							<Link
								key="settings"
								href="/settings"
								className="text-sm font-medium">
								Settings
							</Link>,
							<AlertDialogComponent
								varient="ghost"
								key="logout"
								triggerText="Logout"
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
						className={buttonVariants({ variant: "default" })}>
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}
