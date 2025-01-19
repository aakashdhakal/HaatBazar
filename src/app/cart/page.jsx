"use client";
import { useState, useEffect } from "react";
import CartProduct from "../_components/CartProduct";
import { getCart } from "../actions/cart";

export default function Cart() {
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		const fetchCartItems = async () => {
			const items = await getCart();
			setCartItems(items);
		};

		fetchCartItems();
	}, []);

	const handleRemove = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item._id !== productId),
		);
	};
	return (
		<div className="flex flex-col gap-8 w-full items-center justify-center p-8">
			<div className="w-full">
				<div className="flex justify-between items-center p-4 bg-gray-100 text-gray-500 rounded-lg">
					<p>Product</p>
					<p>Price</p>
					<p>Quantity</p>
					<p>Total</p>
					<p>Action</p>
				</div>
				<div className="w-full flex flex-col gap-4 mt-4">
					{cartItems.map((product, index) => (
						<CartProduct
							product={product}
							key={product._id || index}
							onRemove={handleRemove}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
