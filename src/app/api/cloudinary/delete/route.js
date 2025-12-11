"use server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
	try {
		const { publicId } = await request.json();

		if (!publicId) {
			return NextResponse.json(
				{ success: false, error: "Public ID is required" },
				{ status: 400 },
			);
		}

		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const apiKey = process.env.CLOUDINARY_API_KEY;
		const apiSecret = process.env.CLOUDINARY_API_SECRET;

		if (!cloudName || !apiKey || !apiSecret) {
			return NextResponse.json(
				{ success: false, error: "Cloudinary credentials not configured" },
				{ status: 500 },
			);
		}

		// Generate timestamp and signature for authenticated request
		const timestamp = Math.round(new Date().getTime() / 1000);
		const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
		const signature = crypto
			.createHash("sha1")
			.update(stringToSign)
			.digest("hex");

		// Make the delete request to Cloudinary
		const formData = new FormData();
		formData.append("public_id", publicId);
		formData.append("timestamp", timestamp.toString());
		formData.append("api_key", apiKey);
		formData.append("signature", signature);

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
			{
				method: "POST",
				body: formData,
			},
		);

		const result = await response.json();

		if (result.result === "ok" || result.result === "not found") {
			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error?.message || "Failed to delete image",
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Error deleting image from Cloudinary:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
