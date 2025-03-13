import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-4 sm:gap-2",
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
	{
		variants: {
			variant: {
				default: "bg-white border-gray-200 text-foreground shadow-md",
				success:
					"bg-primary/90 border-primary/30 text-white font-medium shadow-md dark:bg-primary/80",
				error:
					"bg-destructive/90 border-destructive/30 text-white font-medium shadow-md dark:bg-destructive/80",
				warning:
					"bg-secondary/90 border-secondary/30 text-white font-medium shadow-md dark:bg-secondary/80",
				info: "bg-blue-500/90 border-blue-500/30 text-white font-medium shadow-md dark:bg-blue-500/80",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.variant-default]:border-gray-200 group-[.variant-default]:hover:bg-gray-100 group-[.variant-default]:hover:text-foreground group-[.variant-default]:focus:ring-primary group-[.variant-success]:bg-white/20 group-[.variant-success]:text-white group-[.variant-success]:hover:bg-white group-[.variant-success]:hover:text-primary group-[.variant-success]:focus:ring-white group-[.variant-error]:bg-white/20 group-[.variant-error]:text-white group-[.variant-error]:hover:bg-white group-[.variant-error]:hover:text-destructive group-[.variant-error]:focus:ring-white",
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			"absolute right-1 top-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.variant-success]:text-white group-[.variant-error]:text-white group-[.variant-warning]:text-white group-[.variant-info]:text-white",
			className,
		)}
		toast-close=""
		{...props}>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn("text-sm font-bold", className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn("text-sm opacity-90", className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// New component for toast icon
const ToastIcon = ({ variant }) => {
	let iconProps = { className: "h-5 w-5 mr-2" };

	switch (variant) {
		case "success":
			return (
				<Icon icon="mdi:check-circle" className="text-white h-5 w-5 mr-2" />
			);
		case "error":
			return (
				<Icon icon="mdi:alert-circle" className="text-white h-5 w-5 mr-2" />
			);
		case "warning":
			return <Icon icon="mdi:alert" className="text-white h-5 w-5 mr-2" />;
		case "info":
			return (
				<Icon icon="mdi:information" className="text-white h-5 w-5 mr-2" />
			);
		default:
			return null;
	}
};

// Enhanced Toast component with icon
const ToastWithIcon = React.forwardRef(
	({ className, variant, title, description, action, ...props }, ref) => {
		return (
			<Toast ref={ref} variant={variant} className={className} {...props}>
				<div className="flex items-start gap-2">
					<ToastIcon variant={variant} />
					<div>
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
				</div>
				{action && <ToastAction>{action}</ToastAction>}
			</Toast>
		);
	},
);
ToastWithIcon.displayName = "ToastWithIcon";

export {
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
	ToastWithIcon,
};
