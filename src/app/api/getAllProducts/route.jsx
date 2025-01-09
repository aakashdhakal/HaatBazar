"use server";
import dbConnect from "@/app/lib/db";
import Product from "@/app/modals/productModal";

export async function POST(req, res) {
	await dbConnect();

	try {
		const products = await Product.find({});
		return new Response(JSON.stringify(products), { status: 200 });
	} catch (error) {
		console.error("Error fetching products:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
			status: 500,
		});
	}
}
