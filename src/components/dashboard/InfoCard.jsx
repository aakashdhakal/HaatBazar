import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

export default function InfoCard(data) {
	return (
		<Card>
			<CardHeader className="p-0">
				<CardTitle>{data.title}</CardTitle>
			</CardHeader>
			<CardContent className="">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<p className="text-2xl font-bold">{data.value}</p>
					</div>
					<div className="rounded-full bg-primary/10 p-3">
						<Icon icon={data.icon} className="text-primary h-6 w-6" />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<CardDescription>{data.description}</CardDescription>
			</CardFooter>
		</Card>
	);
}
