import { Poppins } from "next/font/google";
import "./globals.css";
import { NavBar } from "./_components/NavBar";
import { SideBar } from "./_components/SideBar";
import AuthProvider from "./_components/AuthProvider";
import { Toaster } from "./_components/ui/toaster";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	title: "HaatBazar",
	description: "An e-commerce platform for all your needs",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={poppins.className}>
					<NavBar />
					{/* <SideBar /> */}
					<main className="p-4">{children}</main>
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}
