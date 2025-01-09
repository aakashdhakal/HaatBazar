import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
	matcher: ["/dashboard", "/admin"],
};

export default withAuth(async (req, res) => {
	console.log(req.nextauth.token.role);

	if (req.url.includes("/admin")) {
		if (req.nextauth.token.role === "user") {
			return NextResponse.redirect(new URL("/denied", req.url));
		}
	}
	// if (req.url.includes("/login")) {
	// 	if (req.nextauth.token) {
	// 		return NextResponse.redirect(new URL("/", req.url));
	// 	}
	// }
});
