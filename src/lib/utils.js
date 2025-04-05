import { HmacSHA256 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import geoNepal from "./geoNepal.json";

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
