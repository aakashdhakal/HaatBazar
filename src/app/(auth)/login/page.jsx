"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Form from "next/form";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const router = useRouter();
	const { status } = useSession();
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const [showPassword, setShowPassword] = useState(false);

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
		<div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
			{/* Background decoration */}

			<div className="flex w-full max-w-screen-xl m-auto p-4 md:p-8 z-10">
				<div className="w-full flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white h-max">
					{/* Left side - Banner (promotional content) */}
					<div className="hidden lg:block lg:w-[45%] bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
						<div className="relative z-10 flex flex-col h-full p-10 lg:p-12 justify-between">
							{/* Banner content */}
							<div>
								<div className="flex items-center mb-12">
									<Image
										src="/HaatBazar-White.png"
										alt="FreshMart"
										width={130}
										height={130}
										className="w-auto h-10"
									/>
								</div>
								<div className="mb-10">
									<h1 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
										Your Everyday Fresh Groceries
									</h1>
									<p className="text-white/90 text-lg leading-relaxed">
										Shop with confidence from our carefully curated selection of
										premium products
									</p>
								</div>

								<div className="space-y-6 mt-10">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:truck-fast-outline"
												width="22"
												height="22"
												className="text-white"
											/>
										</div>
										<div>
											<h3 className="text-white font-medium text-lg mb-1">
												Fast Delivery
											</h3>
											<p className="text-white/80">
												Same-day delivery available in select areas
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:sprout"
												width="22"
												height="22"
												className="text-white"
											/>
										</div>
										<div>
											<h3 className="text-white font-medium text-lg mb-1">
												Fresh & Organic
											</h3>
											<p className="text-white/80">
												Locally sourced organic products
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:ticket-percent"
												width="22"
												height="22"
												className="text-white"
											/>
										</div>
										<div>
											<h3 className="text-white font-medium text-lg mb-1">
												Member Benefits
											</h3>
											<p className="text-white/80">
												Exclusive discounts for registered members
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right side - Form */}
					<div className="w-full lg:w-[55%] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
						<div className="max-w-md mx-auto w-full">
							{/* Mobile logo and back button */}
							<div className="flex items-center justify-between mb-8 lg:hidden">
								<div className="flex items-center gap-2">
									<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
										<Icon
											icon="mdi:shopping"
											className="h-5 w-5 text-primary"
										/>
									</div>
									<span className="font-heading text-lg font-bold text-gray-900">
										FreshMart
									</span>
								</div>
								<Link href="/" className="p-2 rounded-full hover:bg-gray-100">
									<Icon icon="mdi:arrow-left" className="h-5 w-5" />
								</Link>
							</div>

							{/* Form header */}
							<div className="mb-8">
								<h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
									Welcome back
								</h2>
								<p className="text-gray-600">
									Sign in to your account to continue shopping
								</p>
							</div>

							{/* Error message */}
							{error && (
								<div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-fadeIn shadow-sm">
									<Icon
										icon="mdi:alert-circle"
										width="20"
										height="20"
										className="flex-shrink-0 mt-0.5"
									/>
									<p className="text-sm">{error}</p>
								</div>
							)}

							{/* Login form */}
							<Form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-5">
									<div className="space-y-2.5">
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700">
											Email address
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
												className="pl-11 h-12 w-full rounded-md border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
												required
											/>
										</div>
									</div>

									<div className="space-y-2.5">
										<div className="flex items-center justify-between">
											<label
												htmlFor="password"
												className="block text-sm font-medium text-gray-700">
												Password
											</label>
											<Link
												href="/forgot-password"
												className="text-xs font-medium text-primary hover:text-primary-dark transition-colors underline-offset-2 hover:underline">
												Forgot password?
											</Link>
										</div>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<Icon
													icon="mdi:lock-outline"
													width="18"
													height="18"
													className="text-gray-400"
												/>
											</div>
											<Input
												type={showPassword ? "text" : "password"}
												name="password"
												id="password"
												value={formData.password}
												placeholder="••••••••"
												onChange={handleChange}
												className="pl-11 pr-11 h-12 w-full rounded-md border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
												required
											/>
											<button
												type="button"
												className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
												onClick={() => setShowPassword(!showPassword)}>
												<Icon
													icon={
														showPassword
															? "mdi:eye-off-outline"
															: "mdi:eye-outline"
													}
													width="18"
													height="18"
												/>
											</button>
										</div>
									</div>
								</div>

								<div className="flex items-center">
									<input
										id="remember_me"
										name="remember_me"
										type="checkbox"
										className="h-4 w-4 accent-primary text-primary rounded focus:ring-primary border-gray-300 cursor-pointer"
									/>
									<label
										htmlFor="remember_me"
										className="ml-2 block text-sm text-gray-700 cursor-pointer">
										Remember me for 30 days
									</label>
								</div>

								<Button
									type="submit"
									disabled={loading}
									className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg">
									{loading ? (
										<div className="flex items-center justify-center gap-2">
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											<span>Signing in...</span>
										</div>
									) : (
										"Sign in"
									)}
								</Button>

								<div className="relative flex items-center">
									<div className="flex-grow border-t border-gray-200"></div>
									<span className="flex-shrink-0 px-4 text-sm text-gray-500">
										Or continue with
									</span>
									<div className="flex-grow border-t border-gray-200"></div>
								</div>

								<Button
									type="button"
									onClick={() =>
										signIn("google", { redirect: false, redirectTo: "/" })
									}
									className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md w-full"
									variant="outline">
									<Icon icon="flat-color-icons:google" width="18" height="18" />
									<span className="font-medium">Google</span>
								</Button>

								<div className="text-center pt-4">
									<p className="text-sm text-gray-600">
										Don&apos;t have an account?{" "}
										<Link
											href="/signup"
											className="font-medium text-secondary hover:text-secondary-dark transition-colors hover:underline underline-offset-2">
											Create an account
										</Link>
									</p>
								</div>
							</Form>

							<p className="text-xs text-gray-500 text-center mt-8">
								By signing in, you agree to our{" "}
								<Link
									href="/terms"
									className="underline underline-offset-2 hover:text-gray-700">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="/privacy"
									className="underline underline-offset-2 hover:text-gray-700">
									Privacy Policy
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
