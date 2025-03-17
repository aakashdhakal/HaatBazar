import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/auth/auth/auth/auth/auth/auth/auth/auth/login', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/cart", "/wishlist", "/orders/:path*"],
};