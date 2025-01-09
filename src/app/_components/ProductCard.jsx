"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { useToast } from "../hooks/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProductCard({ product }) {
	const { toast } = useToast();
	const { session, status } = useSession();
	const [loading, setLoading] = useState(false);

	const addToCart = () => {
		setLoading(true);
		if (status === "authenticated") {
			toast({
				title: "Product added to cart",
				status: "success",
			});
		} else {
			//add to session storage
			sessionStorage.setItem("cart", JSON.stringify(product));
			toast({
				title: "Product added to cart",
				description: "Please login to save your cart",
				status: "success",
			});
		}
		setLoading(false);
	};

	return (
		<div
			className="flex flex-col items-center gap-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow
      duration-300 w-60 h-80">
			<div className="w-40 h-40 relative">
				<Image
					src={product.image}
					alt={product.name}
					fill="responsive"
					className="rounded-lg object-cover"
				/>
			</div>
			<h2 className="text-l font-semibold text-gray-800">{product.name}</h2>
			<p className="text-l text-gray-600">Rs {product.price}</p>
			<div className="flex gap-4">
				<Button variant="default" onClick={addToCart} isLoading={loading}>
					Add to Cart
				</Button>
				<Button variant="outline" size="icon">
					<Icon icon="solar:heart-linear" width="2rem" height="2rem" />
				</Button>
			</div>
		</div>
	);
}
