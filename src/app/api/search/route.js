import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";

// Search handler using MongoDB
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q")?.toLowerCase() || "";

	if (!query) {
		return NextResponse.json({ results: [] });
	}

	await dbConnect();

	// Search in name and description (case-insensitive)
	const results = await Product.find({
		$or: [
			{ name: { $regex: query, $options: "i" } },
			{ description: { $regex: query, $options: "i" } },
		],
	})
		.limit(10)
		.lean();

	return NextResponse.json({ results });
}
