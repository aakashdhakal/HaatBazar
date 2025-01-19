"use client";
import { createContext, useContext, useState } from "react";

const WishListContext = createContext();

export function WishListProvider({ children }) {
	const [wishListItemsCount, setWishListItemsCount] = useState();

	return (
		<WishListContext.Provider
			value={{ wishListItemsCount, setWishListItemsCount }}>
			{children}
		</WishListContext.Provider>
	);
}

export function useWishList() {
	return useContext(WishListContext);
}
