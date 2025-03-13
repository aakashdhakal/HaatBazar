import { Inter, Poppins, Lora, Montserrat, Work_Sans } from "next/font/google";

// Primary font for most UI elements and body text
export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

// Friendly, modern font for marketing sections
export const poppins = Poppins({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
});

// Elegant serif font for blog posts or luxury items
export const lora = Lora({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lora",
});

// Professional font for headings and call-to-actions
export const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-montserrat",
});

// Clean, minimal font for dashboard and data-heavy pages
export const workSans = Work_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-work-sans",
});
