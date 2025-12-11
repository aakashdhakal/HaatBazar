"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
	const { data: session } = useSession();
	const { theme, setTheme } = useTheme();
	const { toast } = useToast();
	const [mounted, setMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleSavePreferences = () => {
		setIsLoading(true);
		// Simulate save
		setTimeout(() => {
			setIsLoading(false);
			toast({
				title: "Settings saved",
				description: "Your preferences have been updated.",
			});
		}, 500);
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

			<div className="grid gap-6">
				{/* Appearance Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="mdi:palette-outline" className="h-5 w-5" />
							Appearance
						</CardTitle>
						<CardDescription>
							Customize how the dashboard looks and feels
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="theme">Theme</Label>
								<p className="text-sm text-muted-foreground">
									Select your preferred theme
								</p>
							</div>
							<Select value={theme} onValueChange={setTheme}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">
										<div className="flex items-center gap-2">
											<Icon icon="mdi:weather-sunny" className="h-4 w-4" />
											Light
										</div>
									</SelectItem>
									<SelectItem value="dark">
										<div className="flex items-center gap-2">
											<Icon icon="mdi:weather-night" className="h-4 w-4" />
											Dark
										</div>
									</SelectItem>
									<SelectItem value="system">
										<div className="flex items-center gap-2">
											<Icon icon="mdi:laptop" className="h-4 w-4" />
											System
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Account Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="mdi:account-outline" className="h-5 w-5" />
							Account
						</CardTitle>
						<CardDescription>Manage your account information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									defaultValue={session?.user?.name || ""}
									disabled
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									defaultValue={session?.user?.email || ""}
									disabled
								/>
							</div>
						</div>
						<p className="text-sm text-muted-foreground">
							To update your account information, please visit your{" "}
							<a href="/dashboard/profile" className="text-primary underline">
								profile page
							</a>
							.
						</p>
					</CardContent>
				</Card>

				{/* Save Button */}
				<div className="flex justify-end">
					<Button onClick={handleSavePreferences} disabled={isLoading}>
						{isLoading ? (
							<>
								<Icon
									icon="mdi:loading"
									className="mr-2 h-4 w-4 animate-spin"
								/>
								Saving...
							</>
						) : (
							<>
								<Icon icon="mdi:content-save" className="mr-2 h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
