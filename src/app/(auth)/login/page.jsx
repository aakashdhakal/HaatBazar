"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Form from "next/form";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const router = useRouter();
	const { status } = useSession();
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("error")) {
			setError(searchParams.get("error"));
		}
	}, [searchParams]);

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		setError("");

		if (!formData.email || !formData.password) {
			setError("All fields are required");
			setLoading(false);
			return;
		}

		const result = await signIn("credentials", {
			email: formData.email,
			password: formData.password,
			redirect: false,
			redirectTo: "/",
		});

		if (result.code === null) {
			router.push("/");
			setLoading(false);
		} else if (result.code.includes("/signup")) {
			redirect(result.code);
		} else {
			setError(result.code);
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="flex flex-col md:flex-row justify-center items-center sm:px-6 lg:px-8 m-4">
			{/* Left side - Form */}
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg sm:mx-auto md:mx-0 md:mr-8 border border-gray-100 flex flex-col gap-6">
				<div className="text-center flex flex-col items-center gap-4">
					<h2 className="text-2xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="text-sm text-gray-500">
						Sign in to your account to continue
					</p>
				</div>

				{error && (
					<div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md border border-red-100 flex items-center">
						<Icon
							icon="mdi:alert-circle"
							width="20"
							height="20"
							className="mr-2"
						/>
						<p className="text-sm">{error}</p>
					</div>
				)}

				<Form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700">
							Email address
						</label>
						<div className="mt-1 relative rounded-md">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Icon
									icon="mdi:email-outline"
									width="18"
									height="18"
									className="text-gray-400"
								/>
							</div>
							<Input
								type="email"
								name="email"
								id="email"
								value={formData.email}
								placeholder="you@example.com"
								onChange={handleChange}
								className="pl-10 focus:ring-primary focus:border-primary"
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="mt-1 relative rounded-md">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Icon
									icon="mdi:lock-outline"
									width="18"
									height="18"
									className="text-gray-400"
								/>
							</div>
							<Input
								type="password"
								name="password"
								id="password"
								value={formData.password}
								placeholder="••••••••"
								onChange={handleChange}
								className="pl-10 focus:ring-primary focus:border-primary"
								required
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember_me"
								name="remember_me"
								type="checkbox"
								className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
							/>
							<label
								htmlFor="remember_me"
								className="ml-2 block text-sm text-gray-700">
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<Link
								href="/forgot-password"
								className="text-primary hover:text-primary-dark">
								Forgot password?
							</Link>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-2.5 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200">
							{loading ? (
								<div className="flex items-center">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
									<span>Signing in...</span>
								</div>
							) : (
								"Sign in"
							)}
						</Button>
					</div>
				</Form>

				<div>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6">
						<Button
							type="button"
							onClick={() =>
								signIn("google", { redirect: false, redirectTo: "/" })
							}
							className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200"
							variant="outline">
							<Icon icon="flat-color-icons:google" width="20" height="20" />
							<span>Google</span>
						</Button>
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-secondary font-medium hover:text-secondary-dark transition-colors">
							Create an account
						</Link>
					</p>
				</div>
			</div>

			{/* Right side - Image/Banner (visible on md and up) */}
			<div className="hidden md:block max-w-sm">
				<div className="bg-gradient-to-br from-primary/90 to-primary text-white p-8 rounded-lg shadow-lg">
					<h3 className="text-xl font-bold mb-4">Fresh Groceries Delivered</h3>
					<p className="mb-6">
						Get fresh vegetables, fruits and groceries delivered to your
						doorstep.
					</p>

					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<Icon
									icon="mdi:truck-delivery-outline"
									width="20"
									height="20"
									className="text-white"
								/>
							</div>
							<span className="text-sm">Fast delivery to your home</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<Icon
									icon="mdi:leaf"
									width="20"
									height="20"
									className="text-white"
								/>
							</div>
							<span className="text-sm">Farm-fresh quality products</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<Icon
									icon="mdi:tag-outline"
									width="20"
									height="20"
									className="text-white"
								/>
							</div>
							<span className="text-sm">Special member discounts</span>
						</div>
					</div>

					<div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
						<div className="flex -space-x-2">
							<Image
								className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
								src="https://randomuser.me/api/portraits/women/17.jpg"
								alt="Customer profile"
								width={32}
								height={32}
							/>
							<Image
								className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
								src="https://randomuser.me/api/portraits/men/4.jpg"
								alt="Customer profile"
								width={32}
								height={32}
							/>
							<Image
								className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
								src="https://randomuser.me/api/portraits/women/3.jpg"
								alt="Customer profile"
								width={32}
								height={32}
							/>
						</div>
						<span className="text-sm">Join 2,500+ happy customers</span>
					</div>
				</div>
			</div>
		</div>
	);
}
