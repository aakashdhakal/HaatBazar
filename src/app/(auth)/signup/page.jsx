"use client";
import Form from "next/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function Signup() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [accountLinkMessage, setAccountLinkMessage] = useState("");
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();
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
				"Your account is linked with google account. Please fill the form to complete the registration",
			);
		}
	}, [searchParams]);

	const handleSubmit = async (e) => {
		setLoading(true);
		const { name, email, password } = e.target.elements;
		e.preventDefault();
		setError("");
		if (name.value === "" || email.value === "" || password.value === "") {
			setError("All fields are required");
			setLoading(false);
			return;
		} else {
			setFormData({
				name: name.value,
				email: email.value,
				password: password.value,
			});
			const res = await fetch("/api/registerUser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (res.status === 200) {
				setError("Signup successful");
				await signIn("credentials", {
					email: formData.email,
					password: formData.password,
					redirect: true,
					redirectTo: "/",
				});
				setLoading(false);
			} else {
				setError("Signup failed");
				setLoading(false);
			}
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="flex flex-col items-center gap-6 w-full max-w-md m-auto mt-32 p-6 bg-white shadow-lg rounded-lg border-2">
			<h1 className="text-2xl font-bold mb-4">Register your account</h1>
			{accountLinkMessage && (
				<p className="text-sm text-gray-500 text-left">{accountLinkMessage}</p>
			)}
			<Form
				className="flex flex-col gap-4 w-full"
				onSubmit={handleSubmit}
				onChange={handleChange}>
				{error && <p className="text-red-500">{error}</p>}
				<div className="flex flex-col gap-1">
					<label htmlFor="name" className="text-sm">
						Name
					</label>
					<Input
						type="text"
						name="name"
						id="name"
						className="required:border-red-500"
						placeholder="Rajesh Hamal"
						autoComplete="false"
						defaultValue={formData.name}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="email" className="text-sm">
						Email
					</label>
					<Input
						type="email"
						name="email"
						id="email"
						defaultValue={formData.email}
						placeholder="abc@example.com"
						onChange={handleChange}
						className="required:border-red-500"
						autoComplete="false"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="password" className="text-sm">
						Password
					</label>
					<Input
						type="password"
						name="password"
						id="password"
						className="required:border-red-500"
						autoComplete="false"
						placeholder="********"
					/>
				</div>
				<Button
					type="submit"
					variant="default"
					isLoading={loading}
					loadingtext="Signing up">
					Sign Up
				</Button>
			</Form>
			<Separator />
			{accountLinkMessage === "" && (
				<div className="flex flex-col gap-4 w-full">
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							signIn("google", {
								redirect: false,
								redirectTo: "/",
							})
						}
						className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
						<Icon
							icon="flat-color-icons:google"
							width="1.5rem"
							height="1.5rem"
						/>
						Signup with Google
					</Button>
				</div>
			)}
			{/* don't have an account */}
			<div className="flex items-center gap-2 text-sm">
				<p>Alreday have an account ?</p>
				<Link
					href="/login"
					className="text-slate-500 hover:underline font-medium text-sm">
					Login
				</Link>
			</div>
		</div>
	);
}

export default Signup;
