import ProductCard from "./_components/ProductCard";
import { auth } from "./auth";
import getAllProducts from "./actions/products";

export default async function Page() {
	const products = await getAllProducts();
	// 	fetch("http://localhost:3000/api/getAllProducts", {
	// 	method: "POST",
	// }).then((res) => res.json());

	let session = await auth();

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
