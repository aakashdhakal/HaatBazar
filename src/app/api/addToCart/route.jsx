import Cart from "@/app/modals/cartModal";

export default async function POST(req, res) {
	const { userId, productId, quantity } = req.body;
	const cart = await Cart.findOne({ userId, "products.productId": productId });
	if (cart) {
		await Cart.findOneAndUpdate(
			{ userId, "products.productId": productId },
			{ $inc: { "products.$.quantity": quantity } },
		);
	} else {
		await Cart.findOneAndUpdate(
			{ userId },
			{ $push: { products: { productId, quantity } } },
		);
	}
	res.status(200).json({ message: "Added to cart" });
}
// Compare this snippet from src/app/modals/productModal.jsx:
