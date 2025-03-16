"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function NotFound() {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-white gap-4">
			{/* Custom illustration - Using Icon instead of missing file */}
			<div className="mb-8 text-primary/80">
				<Icon icon="mdi:file-search-outline" width="128" height="128" />
			</div>

			<h1 className="text-4xl font-bold text-gray-800 mb-2">
				Oops! Page not found
			</h1>
			<p className="text-gray-600 text-center max-w-md mb-8 leading-loose">
				We couldn&apos;t find the page you&apos;re looking for. It might have
				been removed, renamed, or doesn&apos;t exist.
			</p>

			{/* Primary CTA - FIXED to work with asChild */}
			<Link href="/" className="mb-8">
				<Button className="bg-primary hover:bg-primary-dark text-white">
					<Icon icon="mdi:home" className="mr-2 h-4 w-4" />
					Back to Homepage
				</Button>
			</Link>

			{/* Support contact */}
			<div className="text-center">
				<p className="text-sm text-gray-500">
					Need help?
					<Link href="/contact" className="text-primary hover:underline">
						Contact our support team
					</Link>
				</p>
			</div>
		</div>
	);
}
