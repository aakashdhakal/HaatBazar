"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cartItemCount, setCartItemCount] = useState();

	return (
		<CartContext.Provider value={{ cartItemCount, setCartItemCount }}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	return useContext(CartContext);
}
