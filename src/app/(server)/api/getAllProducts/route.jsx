import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";
import getAllProducts from "@/app/(server)/actions/products";
import { get } from "mongoose";

// // //----------------------------------------------------------
// import User from "../@/modals/userModal";
// import Account from "../@/modals/accountModal";
// // import Session from "@/modals/sessionModal";
// // import VerificationToken from "@/modals/verificationTokenModal";
import Order from "@/modals/orderModal";

// // Account.createCollection();
// // Session.createCollection();
// // VerificationToken.createCollection();
Order.createCollection();

// // //----------------------------------------------------------

import { NextResponse } from "next/server";

export async function POST() {
	const products = await getAllProducts();
	return NextResponse.json(products);
}
