"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Form from "next/form";

export default function Signup() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [accountLinkMessage, setAccountLinkMessage] = useState("");
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const email = searchParams.get("email");
		const name = searchParams.get("name");
		if (email && name) {
			setFormData((prevFormData) => ({
				...prevFormData,
				email,
				name,
			}));
			setAccountLinkMessage(
				"Your account is linked with Google. Please complete your registration.",
			);
		}
	}, [searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const { name, email, password } = e.target.elements;

		if (name.value === "" || email.value === "" || password.value === "") {
			setError("All fields are required");
			setLoading(false);
			return;
		}

		if (password.value.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		setFormData({
			name: name.value,
			email: email.value,
			password: password.value,
		});

		try {
			const res = await fetch("/api/registerUser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.value,
					email: email.value,
					password: password.value,
				}),
			});

			if (res.status === 200) {
				setSuccess("Account created successfully! Signing you in...");

				setTimeout(async () => {
					await signIn("credentials", {
						email: email.value,
						password: password.value,
						redirect: true,
						callbackUrl: "/linkAccount",
					});
				}, 1000);
			} else {
				const data = await res.json();
				setError(data.message || "Signup failed. Please try again.");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
			<div className="flex w-full max-w-screen-xl m-auto p-4 md:p-8 z-10">
				<div className="w-full flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white h-max">
					{/* Left side - Banner (promotional content) */}
					<div className="hidden lg:block lg:w-[45%] bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
						<div className="relative z-10 flex flex-col h-full p-10 lg:p-12 justify-between">
							{/* Banner content */}
							<div>
								<div className="flex items-center mb-12">
									<Image
										src="/HaatBazar-White.png"
										alt="HaatBazar"
										width={130}
										height={130}
										className="w-auto h-10"
									/>
								</div>
								<div className="mb-10">
									<h1 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
										Join Our Community Today
									</h1>
									<p className="text-white/90 text-lg leading-relaxed">
										Create an account to get access to exclusive offers and
										track your orders
									</p>
								</div>

								<div className="space-y-6 mt-10">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:account-check-outline"
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
												Exclusive discounts and early access to sales
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:truck-check-outline"
												width="22"
												height="22"
												className="text-white"
											/>
										</div>
										<div>
											<h3 className="text-white font-medium text-lg mb-1">
												Order Tracking
											</h3>
											<p className="text-white/80">
												Track your orders and delivery status in real-time
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="p-3 bg-white/15 rounded-xl shadow-lg">
											<Icon
												icon="mdi:heart-outline"
												width="22"
												height="22"
												className="text-white"
											/>
										</div>
										<div>
											<h3 className="text-white font-medium text-lg mb-1">
												Saved Favorites
											</h3>
											<p className="text-white/80">
												Save favorite products for quick reordering
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
									<Image
										src="/logoSideText.png"
										alt="HaatBazar"
										width={130}
										height={130}
										className="w-auto h-10"
									/>
								</div>
								<Link href="/" className="p-2 rounded-full hover:bg-gray-100">
									<Icon icon="mdi:arrow-left" className="h-5 w-5" />
								</Link>
							</div>

							{/* Form header */}
							<div className="mb-8">
								<h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
									Create an Account
								</h2>
								<p className="text-gray-600">
									Sign up to get started with HaatBazar
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

							{/* Success message */}
							{success && (
								<div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-start gap-3 animate-fadeIn shadow-sm">
									<Icon
										icon="mdi:check-circle"
										width="20"
										height="20"
										className="flex-shrink-0 mt-0.5"
									/>
									<p className="text-sm">{success}</p>
								</div>
							)}

							{/* Account link message */}
							{accountLinkMessage && (
								<div className="mb-6 bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 flex items-start gap-3 animate-fadeIn shadow-sm">
									<Icon
										icon="mdi:information"
										width="20"
										height="20"
										className="flex-shrink-0 mt-0.5"
									/>
									<p className="text-sm">{accountLinkMessage}</p>
								</div>
							)}

							{/* Signup form */}
							<Form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-5">
									<div className="space-y-2.5">
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700">
											Full Name
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<Icon
													icon="mdi:account-outline"
													width="18"
													height="18"
													className="text-gray-400"
												/>
											</div>
											<Input
												type="text"
												name="name"
												id="name"
												value={formData.name}
												placeholder="John Smith"
												onChange={handleChange}
												className="pl-11 h-12 w-full rounded-md border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
												required
											/>
										</div>
									</div>

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
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700">
											Password
										</label>
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
												minLength={6}
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
										<p className="text-xs text-gray-500">
											Password must be at least 6 characters long
										</p>
									</div>
								</div>

								<div className="flex items-center">
									<input
										id="terms"
										name="terms"
										type="checkbox"
										className="h-4 w-4 accent-primary text-primary rounded focus:ring-primary border-gray-300 cursor-pointer"
										required
									/>
									<label
										htmlFor="terms"
										className="ml-2 block text-sm text-gray-700 cursor-pointer">
										I agree to the{" "}
										<Link
											href="/terms"
											className="text-primary hover:underline">
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy"
											className="text-primary hover:underline">
											Privacy Policy
										</Link>
									</label>
								</div>

								<Button
									type="submit"
									disabled={loading}
									className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg">
									{loading ? (
										<div className="flex items-center justify-center gap-2">
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											<span>Creating account...</span>
										</div>
									) : (
										"Sign up"
									)}
								</Button>

								{accountLinkMessage === "" && (
									<>
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
												signIn("google", { callbackUrl: "/linkAccount" })
											}
											className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md w-full"
											variant="outline">
											<Icon
												icon="flat-color-icons:google"
												width="18"
												height="18"
											/>
											<span className="font-medium">Google</span>
										</Button>
									</>
								)}

								<div className="text-center">
									<p className="text-sm text-gray-600">
										Already have an account?{" "}
										<Link
											href="/login"
											className="font-medium text-primary hover:text-primary-dark transition-colors hover:underline underline-offset-2">
											Sign in
										</Link>
									</p>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
