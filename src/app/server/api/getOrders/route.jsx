"use server";
import { dbConnect } from "@/lib/db";
import { getOrders } from "@/app/server/actions/order";

export async function POST(req) {
	await dbConnect();
	try {
		//fetch order
		const orders = await getOrders();
		return new Response(JSON.stringify(orders), { status: 200 });
	} catch (error) {
		console.error("Error adding product:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch product" }), {
			status: 500,
		});
	}
}
