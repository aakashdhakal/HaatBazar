import { addToCart } from "@/app/(server)/actions/cart";
import dbConnect from "@/lib/db";

export async function POST(req, res) {
	await dbConnect();
	try {
		const productId = req.body.productId;
		const quantity = req.body.quantity || 1;
		const cart = await addToCart({ productId, quantity });
		return new Response(JSON.stringify(cart), { status: 200 });
	} catch (error) {
		console.error("Error adding to cart:", error);
		return new Response(JSON.stringify({ error: "Failed to add to cart" }), {
			status: 500,
		});
	}
}
