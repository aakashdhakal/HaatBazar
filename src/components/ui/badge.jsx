import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"flex items-center rounded-md border text-xs font-semibold px-2 py-1",
	{
		variants: {
			variant: {
				default: "border-transparent shadow",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground shadow",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
