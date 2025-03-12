import { Poppins } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { CartProvider } from "@/context/CartContext";
import { WishListProvider } from "@/context/WishListContext";
import Footer from "@/components/Footer";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	title: "HaatBazar - Fresh Groceries Delivered to Your Doorstep",
	description: "An e-commerce platform for all your needs",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<ReactQueryProvider>
				<AuthProvider>
					<body className={poppins.className}>
						<CartProvider>
							<WishListProvider>
								<NavBar />
								<main className="p-4">{children}</main>
								<Footer />
								<Toaster />
							</WishListProvider>
						</CartProvider>
					</body>
				</AuthProvider>
			</ReactQueryProvider>
		</html>
	);
}
