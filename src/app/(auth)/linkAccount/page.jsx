// pages/linkaccount.jsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { updateUserProfile } from "@/app/(server)/actions/users";

export default function LinkAccount() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.target);
		const address = formData.get("address");
		const paymentInfo = formData.get("paymentInfo");

		const response = await updateUserProfile({ address, paymentInfo });
		if (response.success) {
			router.push("/profile");
		} else {
			alert(response.error);
			setIsSubmitting(false);
		}
	};

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<div>
			<h1>Link Your Account</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="address">Address</label>
					<input type="text" id="address" name="address" required />
				</div>
				<div>
					<label htmlFor="paymentInfo">Payment Information</label>
					<input type="text" id="paymentInfo" name="paymentInfo" required />
				</div>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}
