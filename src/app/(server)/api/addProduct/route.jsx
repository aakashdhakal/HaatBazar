import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";

export async function POST(req) {
	await dbConnect();

	try {
		const body = await req.json();
		const product = new Product({
			name: body.name,
			price: body.price,
			image: body.image,
			brand: body.brand,
			category: body.category,
			countInStock: body.countInStock,
			description: body.description,
			rating: body.rating,
			numReviews: body.numReviews,
		});
		await product.save();
		return new Response(
			JSON.stringify({ message: "Product added successfully" }),
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error adding product:", error);
		return new Response(JSON.stringify({ error: "Failed to add product" }), {
			status: 500,
		});
	}
}
