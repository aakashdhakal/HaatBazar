"use server";
import { dbConnect } from "@/app/lib/db";
import Product from "@/app/modals/productModal";
import getAllProducts from "@/app/actions/products";
import { get } from "mongoose";

// // //----------------------------------------------------------
// import User from "../../modals/userModal";
// import Account from "../../modals/accountModal";
// // import Session from "../modals/sessionModal";
// // import VerificationToken from "../modals/verificationTokenModal";

// // Account.createCollection();
// // Session.createCollection();
// // VerificationToken.createCollection();

// // //----------------------------------------------------------

export async function POST(req, res) {
	const products = await getAllProducts();
	res.json(products);
}
