import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function DropDown({ trigger, items, label }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="border-none outline-none">
				{trigger}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{items.map((item, index) => (
					<DropdownMenuItem key={index} asChild>
						{item}
					</DropdownMenuItem>
				))}
				{/* <DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem> */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
