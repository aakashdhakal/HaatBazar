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
import { getNoOfCartItems } from "../actions/cart";
import { getNoOfWishListItems } from "../actions/wishList";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishListContext";

export function NavBar() {
	const { data: session, status } = useSession();
	const { cartItemCount, setCartItemCount } = useCart();
	const { wishListItemsCount, setWishListItemsCount } = useWishList();

	useEffect(() => {
		const fetchCartItemsCount = async () => {
			setCartItemCount(await getNoOfCartItems());
		};
		const fetchWishListItemsCount = async () => {
			setWishListItemsCount(await getNoOfWishListItems());
		};
		fetchCartItemsCount();
		fetchWishListItemsCount();
	}, [setCartItemCount, setWishListItemsCount]);

	return (
		<nav className="bg-white p-4 px-16 flex justify-between items-center border-b-2 border-gray-200">
			<Link href="/" className="text-2xl font-semibold">
				HAATBAZAAR
			</Link>
			<div className="flex items-center gap-6">
				<Button variant="ghost" size="icon" badge={wishListItemsCount}>
					<Icon icon="iconamoon:heart-light" width="1.7rem" height="1.7rem" />
				</Button>
				<Button variant="ghost" size="icon" badge={cartItemCount || ""}>
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
