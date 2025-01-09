"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify-icon/react";

export function SideBar() {
	const pathname = usePathname();

	return (
		<div className="fixed w-60 h-full flex flex-col items-center p-4 mt-4 bg-white border-r-2 border-gray-200">
			{/* <ul className="flex flex-col gap-4 w-full">
				<li
					className={`w-full p-2 rounded-lg ${
						pathname === "/" ? "bg-black text-white" : ""
					}`}>
					<Link href="/" className="flex gap-2 items-center">
						<Icon icon="lets-icons:home" width="1.6rem" height="1.6rem" /> Home
					</Link>
				</li>
				<li
					className={`w-full p-2 rounded-lg ${
						pathname === "/snacks" ? "bg-black text-white" : ""
					}`}>
					<Link href="/snacks" className="flex gap-2 items-center">
						<Icon
							icon="icon-park-outline:tea-drink"
							width="1.6rem"
							height="1.6rem"
						/>
						Snacks
					</Link>
				</li>
				<li
					className={`w-full p-2 rounded-lg ${
						pathname === "/about" ? "bg-black text-white" : ""
					}`}>
					<Link href="/about" className="flex gap-2 items-center">
						<Icon icon="akar-icons:info" />
						About
					</Link>
				</li>
			</ul> */}
		</div>
	);
}
