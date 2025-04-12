"use server";
import dbConnect from "@/lib/db";
import Product from "@/modals/productModal";
import getAllProducts from "@/app/(server)/actions/products";

import { NextResponse } from "next/server";

export async function POST() {
	const products = await getAllProducts();
	return NextResponse.json(products);
}
