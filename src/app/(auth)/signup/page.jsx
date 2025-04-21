"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const { status } = useSession();
	const searchParams = useSearchParams();

	// Get email and name from query params (Google OAuth flow)
	const email = searchParams.get("email");
	const name = searchParams.get("name");

	// Set form data if coming from OAuth
	if (email && name && formData.email === "" && formData.name === "") {
		setFormData({
			...formData,
			email,
			name,
		});
	}

	// Redirect if already authenticated
	if (status === "authenticated") {
		router.push("/");
		return null;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!formData.name || !formData.email || !formData.password) {
			setError("All fields are required");
			setLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/registerUser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			if (res.status === 200) {
				setSuccess("Account created successfully! Signing you in...");

				setTimeout(async () => {
					await signIn("credentials", {
						email: formData.email,
						password: formData.password,
						redirect: true,
						callbackUrl: "/newUser",
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

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-300/25 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
				{/* Logo and header */}
				<div className="text-center">
					<Link href="/" className="inline-block">
						<Image
							src="/logoSideText.png"
							alt="HaatBazar"
							width={120}
							height={40}
							className="mx-auto h-10 w-auto"
						/>
					</Link>
					<h2 className="mt-6 text-2xl font-bold text-gray-900">
						Create a new account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Or{" "}
						<Link
							href="/login"
							className="font-medium text-primary hover:text-primary-dark">
							sign in to your account
						</Link>
					</p>
				</div>

				{/* Error message */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm">
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				{/* Success message */}
				{success && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-sm">
						<span className="block sm:inline">{success}</span>
					</div>
				)}

				{/* Account link message */}
				{email && name && (
					<div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative text-sm">
						<span className="block sm:inline">
							Your account is linked with Google. Please complete your
							registration.
						</span>
					</div>
				)}

				{/* Signup form */}
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700">
							Full Name
						</label>
						<div className="mt-1 relative">
							<Input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
								placeholder="Enter your full name"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700">
							Email address
						</label>
						<div className="mt-1 relative">
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="mt-1 relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
								placeholder="••••••••"
								minLength={6}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}>
								<Icon
									icon={
										showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
									}
									className="h-5 w-5 text-gray-400"
								/>
							</button>
						</div>
						<p className="mt-1 text-xs text-gray-500">
							Password must be at least 6 characters
						</p>
					</div>

					<div className="flex items-center">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
						/>
						<label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
							I agree to the{" "}
							<Link href="/terms" className="text-primary hover:underline">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy" className="text-primary hover:underline">
								Privacy Policy
							</Link>
						</label>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
							disabled={loading}>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating account...
								</>
							) : (
								"Sign up"
							)}
						</Button>
					</div>
				</form>

				{/* Only show Google sign-in if not already coming from OAuth */}
				{!email && !name && (
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6">
							<button
								onClick={() => signIn("google", { callbackUrl: "/newUser" })}
								className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
								<Icon icon="flat-color-icons:google" className="h-5 w-5 mr-2" />
								Sign up with Google
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
