"use client";
import Form from "next/form";
import { useState } from "react";
import z from "zod";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { Icon } from "@iconify-icon/react";

export function Signup() {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		const { name, email, password } = e.target.elements;
		e.preventDefault();
		setError("");
		if (name.value === "" || email.value === "" || password.value === "") {
			setError("All fields are required");
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
			} else {
				setError("Signup failed");
			}
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="flex flex-col items-center gap-6 w-full max-w-md m-auto mt-32 p-6 bg-white shadow-lg rounded-lg border-2">
			<h1 className="text-2xl font-bold mb-4">Signup</h1>
			<Form
				className="flex flex-col gap-4 w-max"
				onSubmit={handleSubmit}
				onChange={handleChange}>
				{error && <p className="text-red-500">{error}</p>}
				<div className="flex gap-4 items-center">
					<label htmlFor="name">Name</label>
					<Input type="text" name="name" id="name" />
				</div>
				<div className="flex gap-4 items-center">
					<label htmlFor="email">Email</label>
					<Input type="text" name="email" id="email" />
				</div>
				<div className="flex gap-4 items-center">
					<label htmlFor="password">Password</label>
					<Input type="password" name="password" id="password" />
				</div>
				<Button type="submit" variant="default">
					Sign Up
				</Button>
				<div className="flex flex-col gap-4 w-full mt-4">
					<Button
						variant="outline"
						onClick={() => signIn("google")}
						className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
						<Icon
							icon="flat-color-icons:google"
							width="1.5rem"
							height="1.5rem"
						/>
						Signup with Google
					</Button>
					<Button
						variant="outline"
						onClick={() => signIn("github")}
						className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
						<Icon icon="mdi:github" width="2rem" height="2rem" />
						Signup with Github
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default Signup;
