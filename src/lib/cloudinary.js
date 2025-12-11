import crypto from "crypto";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Extract public_id from a Cloudinary URL
 * URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
 */
export function extractPublicId(imageUrl) {
	if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
		return null;
	}

	const urlParts = imageUrl.split("/");
	const uploadIndex = urlParts.indexOf("upload");
	if (uploadIndex === -1) {
		return null;
	}

	// Get everything after 'upload' and version (e.g., v1234567890)
	const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
	// Remove the file extension to get the public_id
	const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");

	return publicId;
}

/**
 * Delete an image from Cloudinary (server-side only)
 * @param {string} imageUrl - The full Cloudinary URL of the image
 * @returns {Promise<boolean>} - Returns true if deletion was successful
 */
export async function deleteCloudinaryImage(imageUrl) {
	if (!imageUrl) {
		console.warn("No image URL provided for deletion");
		return false;
	}

	// Skip deletion if it's not a Cloudinary URL
	if (!imageUrl.includes("cloudinary.com")) {
		console.warn("Not a Cloudinary URL, skipping deletion:", imageUrl);
		return false;
	}

	const publicId = extractPublicId(imageUrl);
	if (!publicId) {
		console.warn("Could not extract public_id from URL:", imageUrl);
		return false;
	}

	if (!cloudName || !apiKey || !apiSecret) {
		console.error("Cloudinary credentials not configured");
		throw new Error("Cloudinary credentials not configured");
	}

	try {
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
			console.log("Image deleted successfully from Cloudinary:", publicId);
			return true;
		} else {
			console.error("Failed to delete image from Cloudinary:", result);
			return false;
		}
	} catch (error) {
		console.error("Error deleting image from Cloudinary:", error);
		throw new Error("Failed to delete image from Cloudinary");
	}
}

/**
 * Upload an image to Cloudinary (server-side with signed upload)
 * @param {File|Blob} file - The file to upload
 * @param {string} fileName - The desired public_id for the image
 * @param {string} folder - The folder to upload to (default: 'haatbazar')
 * @returns {Promise<string>} - Returns the secure URL of the uploaded image
 */
export async function uploadCloudinaryImage(
	file,
	fileName,
	folder = "haatbazar",
) {
	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error("Cloudinary credentials not configured");
	}

	try {
		// Generate timestamp and signature for authenticated request
		const timestamp = Math.round(new Date().getTime() / 1000);
		const stringToSign = `folder=${folder}&public_id=${fileName}&timestamp=${timestamp}${apiSecret}`;
		const signature = crypto
			.createHash("sha1")
			.update(stringToSign)
			.digest("hex");

		// Prepare the FormData
		const formData = new FormData();
		formData.append("file", file);
		formData.append("public_id", fileName);
		formData.append("folder", folder);
		formData.append("timestamp", timestamp.toString());
		formData.append("api_key", apiKey);
		formData.append("signature", signature);

		// Upload to Cloudinary
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		const result = await response.json();

		if (response.ok && result.secure_url) {
			return result.secure_url;
		} else {
			throw new Error(
				`Failed to upload image: ${result.error?.message || "Unknown error"}`,
			);
		}
	} catch (error) {
		console.error("Error uploading image to Cloudinary:", error);
		throw new Error("Failed to upload image to Cloudinary");
	}
}
