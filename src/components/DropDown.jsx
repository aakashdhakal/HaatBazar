"use client";
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
		<DropdownMenu modal={false}>
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
