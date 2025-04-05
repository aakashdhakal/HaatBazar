"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import SelectComponent from "@/components/Select";

function CustomCaption({ date, setMonth, locale }) {
	// Use the `date` prop directly (it reflects the current `month` state)
	const safeDate = date;

	const months = Array.from({ length: 12 }, (_, i) =>
		new Date(0, i).toLocaleString(locale, { month: "long" }),
	);
	const currentYear = new Date().getFullYear();
	const years = Array.from(
		{ length: currentYear - 1990 + 1 },
		(_, i) => 1990 + i,
	);

	const handleMonthChange = (monthIndex) => {
		// Update the month while keeping the same year
		const newDate = new Date(safeDate.getFullYear(), monthIndex);
		setMonth(newDate);
	};

	const handleYearChange = (year) => {
		// Update the year while keeping the same month
		const newDate = new Date(year, safeDate.getMonth());
		setMonth(newDate);
	};


	return (
		<div className="flex gap-2 items-center">
			<SelectComponent
				label="Month"
				options={months.map((month, index) => ({ label: month, value: index }))}
				value={safeDate.getMonth().toString()} // Use the month index as the value
				onValueChange={handleMonthChange}
			/>
			<SelectComponent
				label="Year"
				options={years.map((year) => ({ label: year.toString(), value: year }))}
				value={safeDate.getFullYear().toString()} // Use the year as the value
				onValueChange={handleYearChange}
				className="whitespace-nowrap"
			/>
		</div>
	);
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
	const [month, setMonth] = React.useState(new Date());

	return (
		<DayPicker
			month={month}
			onMonthChange={setMonth} // This updates the `month` state
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-2",
				caption: "flex justify-between items-center pt-1 relative w-full",
				caption_label: "text-sm font-medium mx-auto",
				nav: "flex items-center gap-1",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "",
				month: "flex flex-col gap-4",
				nav_button_next: "",
				table: "w-full border-collapse space-x-1",
				head_row: "flex",
				head_cell:
					"text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-md",
				),
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"size-8 p-0 font-normal aria-selected:opacity-100",
				),
				day_range_start:
					"day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_range_end:
					"day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_selected:
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground aria-selected:text-muted-foreground",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: ({ className, ...props }) => (
					<ChevronLeft className={cn("size-4", className)} {...props} />
				),
				IconRight: ({ className, ...props }) => (
					<ChevronRight className={cn("size-4", className)} {...props} />
				),
				Caption: (captionProps) => (
					<CustomCaption {...captionProps} date={month} setMonth={setMonth} />
				),
			}}
			{...props}
		/>
	);
}

export { Calendar };
