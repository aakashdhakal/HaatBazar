"use client";

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	ToastWithIcon,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				// Use the enhanced ToastWithIcon component for all toasts
				return (
					<ToastWithIcon
						key={id}
						title={title}
						description={description}
						action={action}
						{...props}>
						<div className="flex items-start gap-4">
							<div>
								{title && <ToastTitle>{title}</ToastTitle>}
								{description && (
									<ToastDescription>{description}</ToastDescription>
								)}
							</div>
						</div>
						{action}
						<ToastClose />
					</ToastWithIcon>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
