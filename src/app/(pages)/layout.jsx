import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function PagesLayout({ children }) {
	return (
		<>
			<NavBar />
			<main className="min-h-96 bg-gray-50">{children}</main>
			<Footer />
		</>
	);
}
