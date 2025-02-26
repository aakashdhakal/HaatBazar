"use client";
import React, { useState, useEffect } from "react";

const LinkAccountPage = ({ params }) => {
	const [password, setPassword] = useState("");
	const [address, setAddress] = useState("");
	const [id, setId] = useState(null);

	useEffect(() => {
		params.then((resolvedParams) => {
			setId(resolvedParams.id);
		});
	}, [params]);

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here
		console.log("Password:", password);
		console.log("Address:", address);
	};

	return (
		<div>
			<h1>Link Your Account</h1>
			{id && <p>Account ID: {id}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="address">Address:</label>
					<input
						type="text"
						id="address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default LinkAccountPage;
