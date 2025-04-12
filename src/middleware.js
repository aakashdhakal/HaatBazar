import { NextResponse } from "next/server";
import { auth } from "./app/auth";

export async function middleware(req) {
	const session = await auth();
	const isAuthenticated = session?.user;
	if (!isAuthenticated) {
		const isPublicPath =
			req.nextUrl.pathname.startsWith("/login") ||
			req.nextUrl.pathname.startsWith("/register");
		if (!isPublicPath) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	} else {
		const isAuthPath =
			req.nextUrl.pathname.startsWith("/login") ||
			req.nextUrl.pathname.startsWith("/register");
		if (isAuthPath) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/cart", "/wishlist", "/orders/:path*"],
};
