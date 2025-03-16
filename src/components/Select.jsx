import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export default function SelectComponent({ label, options, ...rest }) {
	return (
		<Select {...rest}>
			<SelectTrigger>
				<SelectValue>{label}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{options.map((option, index) => (
					<SelectItem key={index} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
