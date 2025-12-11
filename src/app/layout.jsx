import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { CartProvider } from "@/context/CartContext";
import { WishListProvider } from "@/context/WishListContext";

import { inter, poppins, lora, montserrat, workSans } from "@/components/Fonts";

export const metadata = {
	title: "HaatBazar - Fresh Groceries Delivered to Your Doorstep",
	description: "An e-commerce platform for all your needs",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<ReactQueryProvider>
				<AuthProvider>
					<body
						className={`${inter.variable} ${poppins.variable} ${lora.variable} ${montserrat.variable} ${workSans.variable}`}>
						<ThemeProvider>
							<CartProvider>
								<WishListProvider>
									{children}
									{/* Each group will handle Navbar/Footer separately */}
									<Toaster />
								</WishListProvider>
							</CartProvider>
						</ThemeProvider>
					</body>
				</AuthProvider>
			</ReactQueryProvider>
		</html>
	);
}
