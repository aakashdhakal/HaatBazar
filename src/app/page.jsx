import ProductCard from "./_components/ProductCard";

export default async function Page() {
	const products = await fetch("http://localhost:3000/api/getAllProducts", {
		method: "POST",
	}).then((res) => res.json());

	return (
		<div>
			<div className="grid grid-cols-6">
				{products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
}
