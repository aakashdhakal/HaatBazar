"use client";
import { useSession } from "next-auth/react";
import { options } from "../api/auth/[...nextauth]/option";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import AlertDialogComponent from "./AlertDialog";
import { signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";
import DropDown from "./DropDown";

export function NavBar() {
	const { data: session, status } = useSession(options);

	return (
		<nav className="bg-white p-4 px-16  flex justify-between items-center border-b-2 border-gray-200">
			<Link href={"/"} className="text-2xl font-semibold">
				HAATBAZAAR
			</Link>
			<div className="flex items-center gap-4">
				<div className="flex gap-8 h-max">
					<Button variant="ghost" size="icon">
						<iconify-icon
							icon="iconamoon:heart-light"
							width="1.5rem"
							height="1.5rem"></iconify-icon>
					</Button>
					<Button variant="ghost" size="icon">
						<iconify-icon
							icon="solar:cart-large-linear"
							width="1.7rem"
							height="1.7rem"></iconify-icon>
					</Button>

					{status === "authenticated" ? (
						<div className="flex gap-4 items-center">
							<DropDown
								className="dropdown"
								trigger={<UserAvatar src={session.user.profilePic} />}
								label={session.user.name}
								items={[
									<Link
										key="profile"
										href="/profile"
										className="text-sm font-medium">
										Profile
									</Link>,
									<Link
										key="orders"
										href="/orders"
										className="text-sm font-medium">
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
						</div>
					) : (
						<Link
							href="/login"
							className={buttonVariants({ variant: "default" })}>
							LOGIN
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
