import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const { pathname } = req.nextUrl;

	if (["/cart", "/wishlist"].includes(pathname) && !token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (pathname.startsWith("/admin") && token?.role !== "admin") {
		return NextResponse.redirect(new URL("/404", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/cart", "/wishlist", "/admin/:path*"],
};
