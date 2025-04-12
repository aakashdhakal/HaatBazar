import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
	const secret = process.env.NEXTAUTH_SECRET;
	if (!secret) {
		return NextResponse.redirect(new URL("/login", req.url));
	}
	const token = await getToken({ req, secret });
	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/cart", "/wishlist", "/orders/:path*"],
};
