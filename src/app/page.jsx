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
		<div className="container mx-auto flex flex-col gap-4">
			{/* add banner */}
			<div className="h-96 bg-gray-200 rounded-md">
				<div className="flex justify-center items-center h-full">
					<h1 className="text-4xl font-semibold">Welcome to HaatBazar</h1>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold">Recommended For You</h2>
				<div className="grid grid-cols-6">
					{products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}
