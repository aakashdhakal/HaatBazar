"use server";
import Cart from "@/modals/cartModal";
import Order from "@/modals/orderModal";
import { auth } from "@/app/auth";
import { getProductById } from "./products";
import { revalidatePath } from "next/cache";

export async function addToCart(product) {
	let session = await auth();

	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's cart
	let cart = await Cart.findOne({ userId: userId });

	if (!cart) {
		// If no cart exists, create a new cart
		cart = new Cart({
			userId: userId,
			products: [{ productId: product._id, quantity: product.quantity }],
		});
	} else {
		// If cart exists, check if the product is already in the cart
		const item = cart.products.find(
			(item) => item.productId.toString() === product._id.toString(),
		);

		if (item) {
			// If product is already in the cart, increment the quantity
			item.quantity += product.quantity;
		} else {
			// If product is not in the cart, add the product to the cart
			cart.products.push({
				productId: product._id,
				quantity: product.quantity,
			});
		}
	}
	// Save the cart
	await cart.save();
	let noOfItems = await getNoOfCartItems();

	return { status: "success", message: "Added to cart", noOfItems };
}

export async function getCart() {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's cart
	let cart = await Cart.findOne({ userId: userId });
	if (!cart) {
		return [];
	} else {
		// Get the products in the cart
		const products = await Promise.all(
			cart.products.map(async (item) => {
				try {
					const product = await getProductById(item.productId);
					if (!product) {
						console.warn(`Product not found for ID: ${item.productId}`);
						return null; // Skip invalid products
					}
					return {
						...product,
						_id: product._id.toString(),
						quantity: item.quantity,
					};
				} catch (error) {
					console.error(
						`Error fetching product with ID: ${item.productId}`,
						error,
					);
					return null; // Skip products that cause errors
				}
			}),
		);

		// Filter out null values (invalid products)
		return products.filter((product) => product !== null);
	}
}

export async function getNoOfCartItems() {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;
	// Find the user's cart
	let cart = await Cart.findOne({ userId: userId });
	if (!cart) {
		return false;
	} else {
		// Get the total number of items in the cart
		const totalItems = cart.products.length;
		revalidatePath("/");
		return totalItems;
	}
}

export async function updateQuantity({ productId, quantity }) {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's cart
	let cart = await Cart.findOne({ userId: userId });

	if (!cart) {
		return false;
	} else {
		// Find the product in the cart
		const item = cart.products.find(
			(item) => item.productId.toString() === productId.toString(),
		);
		if (!item) {
			// If product is not in the cart, return false
			return false;
		} else {
			// Update the quantity of the product
			item.quantity = quantity;
			await cart.save();
			return true;
		}
	}
}

export async function removeFromCart({ productId }) {
	let session = await auth();
	if (session === null) return false;

	const userId = session.user.id;

	// Find the user's cart
	let cart = await Cart.findOne({ userId: userId });
	if (!cart) return false;

	// Find the product in the cart
	const index = cart.products.findIndex(
		(item) => item.productId.toString() === productId.toString(),
	);
	if (index === -1) return false;

	// Remove the product from the cart
	cart.products.splice(index, 1);
	await cart.save();
	let noOfItems = await getNoOfCartItems();
	return { status: "success", message: "Removed from cart", noOfItems };
}

export async function clearCart() {
	try {
		let session = await auth();
		if (session === null) return false;

		const userId = session.user.id;

		// Find the user's cart
		let cart = await Cart.deleteOne({ userId: userId });
		if (!cart) return false;

		return true;
	} catch (error) {
		console.error("Error clearing cart:", error);
		return false;
	}
}
