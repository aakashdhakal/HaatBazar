import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DialogComponent({ ...props }) {
	// Determine dialog width based on size prop

	return (
		<Dialog open={props.open} onOpenChange={props.onClose}>
			{props.triggerText && (
				<DialogTrigger asChild>
					<Button variant={props.varient}>{props.triggerText}</Button>
				</DialogTrigger>
			)}
			<DialogContent
				className={cn("md:max-w-[450px] w-[450px]" + props.className)}>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-xl">{props.title}</DialogTitle>
					<DialogDescription className="text-base mt-2">
						{props.description}
					</DialogDescription>
				</DialogHeader>
				<div className="my-2">{props.content}</div>
				<DialogFooter className="mt-6">
					{props.action && (
						<Button
							type="button"
							onClick={props.action}
							className="px-6 py-2.5 text-base">
							{props.actionText || "Save changes"}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
