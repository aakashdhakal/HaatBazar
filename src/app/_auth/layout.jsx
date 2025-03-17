import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }) {
	return (
		<>
			<main className="min-h-screen">{children}</main>
		</>
	);
}
