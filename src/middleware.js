import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

export async function middleware(req) {
	const session = await getSession({ req });

	if (!session) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (session.user.role !== "admin") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/cart", "/wishlist", "/orders/:path*"],
};
