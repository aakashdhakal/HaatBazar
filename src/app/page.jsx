import Home from "./(pages)/(home)/page";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Index() {
	return (
		<>
			<NavBar />
			<Home />
			<Footer />
		</>
	);
}
