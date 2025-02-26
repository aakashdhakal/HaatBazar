"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { getProductById } from "@/app/actions/products";

const ProductPage = ({ params }) => {
	const [product, setProduct] = useState(null);
	const [resolvedParams, setResolvedParams] = useState(null);

	useEffect(() => {
		const resolveParams = async () => {
			const unwrappedParams = await params;
			setResolvedParams(unwrappedParams);
		};
		resolveParams();
	}, [params]);

	useEffect(() => {
		if (resolvedParams) {
			const fetchProduct = async () => {
				const product = await getProductById(resolvedParams.slug);
				setProduct(product);
			};
			fetchProduct();
		}
	}, [resolvedParams]);

	console.log(product);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/2">
					{product && (
						<Image
							src={product.image}
							alt={product.name}
							width={500}
							height={500}
							className="w-full h-auto"
						/>
					)}
					{product && (
						<>
							<h1 className="text-3xl font-bold mb-4">{product.name}</h1>
							<p className="text-xl text-gray-700 mb-4">${product.price}</p>
							<p className="text-gray-600 mb-4">{product.description}</p>
							<Button>Add to Cart</Button>
						</>
					)}
				</div>
			</div>
			{/* <div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Related Products</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Map through related products and display them here 
					{product.relatedProducts?.map((relatedProduct) => (
						<div key={relatedProduct.id} className="border p-4">
							<Image
								src={relatedProduct.image}
								alt={relatedProduct.name}
								width={300}
								height={300}
								className="w-full h-auto"
							/>
							<h3 className="text-xl font-bold mt-2">{relatedProduct.name}</h3>
							<p className="text-gray-700">${relatedProduct.price}</p>
						</div>
					))}
				</div>
			</div> */}
		</div>
	);
};

export default ProductPage;
