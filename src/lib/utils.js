import { HmacSHA256 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import geoNepal from "./geoNepal.json";
import slugify from "slugify";

export function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-NP", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// Format currency
export const formatCurrency = (amount) => {
	return new Intl.NumberFormat("en-NP", {
		style: "currency",
		currency: "NPR",
		maximumFractionDigits: 0,
	}).format(amount);
};

export const hashData = (message) => {
	const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;
	return Base64.stringify(HmacSHA256(message, secretKey));
};

export const decodeData = (data) => {
	const decoded = JSON.parse(atob(data));
	return decoded;
};

export const getProvinces = () => {
	return Object.keys(geoNepal);
};

export const getDistricts = (provinceName) => {
	const province = geoNepal[provinceName];
	return province ? province.map((district) => district.district) : [];
};

export const getCities = (provinceName, districtName) => {
	const province = geoNepal[provinceName];
	if (!province) return [];

	const district = province.find(
		(district) => district.district === districtName,
	);
	return district ? district.cities : [];
};

export const formatAddress = (address) => {
	return `${address.street}, ${address.city}, ${address.district}, ${address.province}, ${address.ZIP}`;
};

export const formatDateOfBirth = (dateString) => {
	return new Date(dateString).toLocaleDateString("en-NP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const generateFileName = (name) => {
	name = slugify(name, {
		lower: true,
		strict: true,
	});
	const timestamp = Date.now();
	const randomNum = Math.floor(Math.random() * 1000);
	const fileName = `${name}-${timestamp}-${randomNum}`;
	return fileName;
};

export async function deleteImage(imageUrl) {
	// Basic validation
	if (!imageUrl) {
		throw new Error("Invalid image URL");
	}

	try {
		// Extract the public_id from the Cloudinary URL
		// URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
		const urlParts = imageUrl.split("/");
		const uploadIndex = urlParts.indexOf("upload");
		if (uploadIndex === -1) {
			throw new Error("Invalid Cloudinary URL");
		}

		// Get everything after 'upload' and version (e.g., v1234567890)
		const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
		// Remove the file extension to get the public_id
		const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");

		// Make the DELETE request to our API route
		const response = await fetch("/api/cloudinary/delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ publicId }),
		});

		const responseData = await response.json();

		if (response.ok && responseData.success) {
			console.log("Image deleted successfully from Cloudinary");
			return true;
		} else {
			throw new Error(
				`Failed to delete image: ${responseData.error || "Unknown error"}`,
			);
		}
	} catch (error) {
		console.error("Error deleting image:", error);
		throw new Error("Failed to delete product image");
	}
}

export async function uploadImage(file, name) {
	// Basic validation
	if (!file || !file.name || !file.size) {
		throw new Error("Invalid file object");
	}

	try {
		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const uploadPreset = "haatbazar"; // unsigned upload preset name

		// Generate a unique filename
		const fileName = generateFileName(name);

		// Prepare the FormData for Cloudinary upload
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", uploadPreset);
		formData.append("folder", "haatbazar"); // Store in haatbazar folder
		formData.append("public_id", fileName);

		// Upload to Cloudinary
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		const responseData = await response.json();

		if (response.ok && responseData.secure_url) {
			return responseData.secure_url; // Return the Cloudinary URL
		} else {
			throw new Error(
				`Failed to upload image: ${
					responseData.error?.message || "Unknown error"
				}`,
			);
		}
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload product image");
	}
}

export function normalizePaymentResponse(parameters, isEsewa = false) {
	if (isEsewa) {
		// Decode eSewa's encoded data
		const decodedData = decodeData(parameters.get("data")); // Assuming decodeData is already implemented
		return {
			transactionId: decodedData.transaction_code,
			status: decodedData.status,
			totalAmount: parseFloat(decodedData.total_amount.replace(/,/g, "")), // Remove commas and convert to number
			transactionUuid: decodedData.transaction_uuid,
			productCode: decodedData.product_code,
		};
	} else {
		// Normalize Khalti's query parameters
		return {
			transactionId:
				parameters.get("transaction_id") || parameters.get("txnId"),
			status: parameters.get("status") === "Completed" ? "SUCCESS" : "FAILED",
			totalAmount: parseFloat(parameters.get("total_amount")) || 0,
			transactionUuid: parameters.get("purchase_order_id"),
			productCode: parameters.get("purchase_order_name"),
		};
	}
}
