"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Form from "next/form";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";
import { Icon } from "@iconify/react";

export default function Login() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);
	const [formData, setFormData] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormData({
			email: e.target.email.value,
			password: e.target.password.value,
		});

		if (!formData.email || !formData.password) {
			alert("Please fill in all the fields");
			return;
		} else {
			signIn("credentials", {
				username: formData.email,
				password: formData.password,
				callbackUrl: "/",
			});
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="flex flex-col items-center gap-6 w-full max-w-md m-auto mt-32 p-6 bg-white shadow-lg rounded-lg border-2">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<Form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full"
				onChange={handleChange}>
				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm font-medium">
						Email
					</label>
					<input
						type="text"
						name="email"
						id="email"
						className="border-gray-300 border-2 outline-none p-2 rounded-lg focus:border-blue-500"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="password" className="text-sm font-medium">
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						className="border-gray-300 border-2 outline-none p-2 rounded-lg focus:border-blue-500"
					/>
				</div>
				<Button
					variant="default"
					type="submit"
					className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
					Login
				</Button>
			</Form>
			<div className="flex flex-col gap-4 w-full mt-4">
				<Button
					variant="outline"
					onClick={() => signIn("google")}
					className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
					<Icon icon="flat-color-icons:google" width="1.5rem" height="1.5rem" />
					Login with Google
				</Button>
				<Button
					variant="outline"
					onClick={() => signIn("github")}
					className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
					<Icon icon="mdi:github" width="2rem" height="2rem" />
					Login with Github
				</Button>
			</div>
		</div>
	);
}
