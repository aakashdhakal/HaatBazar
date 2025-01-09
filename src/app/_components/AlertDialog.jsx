import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export default function AlertDialogComponent(props) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={props.varient}>{props.triggerText}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{props.alertTitle}</AlertDialogTitle>
					<AlertDialogDescription>
						{props.alertDescription}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{props.cancelText}</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant="default" onClick={props.action}>
							{props.actionText}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
