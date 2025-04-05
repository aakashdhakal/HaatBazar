"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative ",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90 cursor-pointer",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 cursor-pointer",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 cursor-pointer",
				ghost: "hover:text-accent-foreground",
				link: "text-primary hover:text-accent-foreground",
				dropdown: "cursor-default hover:text-destructive",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "px-0 py-0 h-9 w-9",
				dropdown: "px-2.5 py-1",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const Button = React.forwardRef(
	(
		{ className, variant, size, asChild = false, isLoading, badge, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
				disabled={isLoading || props.disabled}>
				{isLoading ? (
					<>
						<Icon
							icon="eos-icons:bubble-loading"
							width="1.5rem"
							height="1.5rem"
						/>
						{props.loadingtext}
					</>
				) : (
					props.children
				)}
				{badge && (
					<span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 w-4 h-4 rounded-full text-[10px] font-bold leading-none text-white bg-black ">
						{badge}
					</span>
				)}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
