"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { useSession } from "next-auth/react";
import Form from "next/form";
import { Separator } from "../_components/ui/separator";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const router = useRouter();
	const { status } = useSession();
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	useEffect(() => {
		//if error in query params
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
		console.log(result);
		if (result.code === null) {
			router.push("/");
			setLoading(false);
		} else {
			setError(result.code);
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const login = async (provider) => {
		const result = await signIn(provider, {
			redirect: false,
			callbackUrl: "/login",
		});
		console.log(result);
	};

	return (
		<div className="flex flex-col items-center gap-6 w-full max-w-md m-auto mt-32 p-6 bg-white shadow-lg rounded-lg border-2">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<Form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
				{error && <p className="text-red-500">{error}</p>}
				<div className="flex flex-col gap-1 ">
					<label htmlFor="email" className="text-sm">
						Email
					</label>
					<Input
						type="email"
						name="email"
						id="email"
						value={formData.email}
						placeholder="abc@example.com"
						onChange={handleChange}
						className="required:border-red-500"
						autoComplete="false"
					/>
				</div>
				<div className="flex flex-col gap-1 ">
					<label htmlFor="password" className="text-sm">
						Password
					</label>
					<Input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						placeholder="********"
						onChange={handleChange}
						autoComplete="false"
					/>
				</div>
				<Button
					type="submit"
					variant="default"
					isLoading={loading}
					loadingtext="Logging in">
					Login
				</Button>
			</Form>
			<Separator />
			<div className="flex flex-col gap-4 w-full">
				<Button
					type="button"
					variant="outline"
					onClick={() => login("google")}
					className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
					<Icon icon="flat-color-icons:google" width="1.5rem" height="1.5rem" />
					Login with Google
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => login("github")}
					className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
					<Icon icon="mdi:github" width="2rem" height="2rem" />
					Login with Github
				</Button>
			</div>
			{/* don't have an account */}
			<div className="flex items-center gap-2">
				<p>Don&apos;t have an account ?</p>
				<Link
					href="/signup"
					className="text-slate-500 hover:underline  font-medium">
					Register Now
				</Link>
			</div>
		</div>
	);
}
