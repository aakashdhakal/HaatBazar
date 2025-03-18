import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function PageLayout({ children }) {
	return (
		<>
			<NavBar />
			<main>{children}</main>
			<Footer />
		</>
	);
}
