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
		// Make the POST request to the API
		const response = await fetch(
			"https://downloadmedia.aakashdhakal.com.np/api/delete-image",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ file_url: imageUrl }),
			},
		);

		// Parse the JSON response
		const responseData = await response.json();

		// Check if the response indicates success
		if (response.ok && responseData.message === "Image deleted successfully") {
			console.log("Image deleted successfully");
			return true; // Indicate success
		} else {
			throw new Error(
				`Failed to delete image: ${responseData.error || "Unknown error"}`,
			);
		}
	} catch (error) {
		throw new Error("Failed to delete product image");
	}
}

export async function uploadImage(file, name) {
	// Basic validation
	if (!file || !file.name || !file.size) {
		throw new Error("Invalid file object");
	}

	try {
		console.log("File data:", file); // Debugging line

		// Prepare the payload for the API
		const formData = new FormData();
		const fileName = generateFileName(name);
		formData.append("name", fileName);
		formData.append("image", file); // Append the file object directly

		console.log("FormData prepared:", formData); // Debugging line

		// Make the POST request to the API
		const response = await fetch(
			"https://downloadmedia.aakashdhakal.com.np/api/upload-image",
			{
				method: "POST",
				body: formData,
			},
		);

		// Parse the JSON response
		const responseData = await response.json();

		// Check if the response contains the image URL
		if (response.ok && responseData.image_url) {
			return responseData.image_url; // Return the image URL
		} else {
			throw new Error(
				`Failed to upload image: ${responseData.error || "Unknown error"}`,
			);
		}
	} catch (error) {
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
