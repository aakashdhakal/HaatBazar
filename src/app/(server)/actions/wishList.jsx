"use server";
import WishList from "@/modals/wishListModal";
import { auth } from "@/app/auth";
import { getProductById } from "./products";

export async function addToWishList(product) {
	let session = await auth();

	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's wishlist
	let wishlist = await WishList.findOne({ userId: userId });

	if (!wishlist) {
		// If no wishlist exists, create a new wishlist
		wishlist = new WishList({
			userId: userId,
			products: [{ productId: product._id }],
		});
	} else {
		// If wishlist exists, check if the product is already in the wishlist
		const item = wishlist.products.find(
			(item) => item.productId.toString() === product._id.toString(),
		);

		if (item) {
			// If product is already in the wishlist, increment the quantity
			item.quantity += product.quantity;
		} else {
			// If product is not in the wishlist, add the product to the wishlist
			wishlist.products.push({
				productId: product._id,
			});
		}
	}
	// Save the wishlist
	await wishlist.save();
	let noOfItems = await getNoOfWishListItems();

	return { status: "success", message: "Added to wishlist", noOfItems };
}

export async function getWishList() {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's wishlist
	let wishlist = await WishList.findOne({ userId: userId });
	if (!wishlist) {
		return [];
	} else {
		// Get the products in the wishlist
		const products = await Promise.all(
			wishlist.products.map(async (item) => {
				const product = await getProductById(item.productId);
				return {
					...product,
					_id: product._id.toString(),
					quantity: item.quantity,
				};
			}),
		);
		return products;
	}
}

export async function getNoOfWishListItems() {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;
	// Find the user's wishlist
	let wishlist = await WishList.findOne({ userId: userId });
	if (!wishlist) {
		return false;
	} else {
		return wishlist.products.length;
	}
}

// Remove a product from the wishlist

export async function removeFromWishList(product) {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's wishlist
	let wishlist = await WishList.findOne({ userId });
	if (!wishlist) {
		return false;
	} else {
		// Remove the product from the wishlist
		wishlist.products = wishlist.products.filter(
			(item) => item.productId.toString() !== product._id.toString(),
		);
		await wishlist.save();
		let noOfItems = await getNoOfWishListItems();
		return { status: "success", message: "Removed from wishlist", noOfItems };
	}
}
