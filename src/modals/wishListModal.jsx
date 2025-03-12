"use server";
import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		},
	],
});

const WishList =
	mongoose.models.WishList || mongoose.model("WishList", WishListSchema);
export default WishList;
