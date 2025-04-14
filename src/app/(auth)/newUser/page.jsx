"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { updateUserProfile } from "@/app/(server)/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify-icon/react";
import SelectComponent from "@/components/Select";
import { getProvinces, getDistricts, getCities } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/DatePicker";
import Form from "next/form";
import Loading from "@/app/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "next/navigation";

export default function LinkAccount() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [profileImage, setProfileImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [cities, setCities] = useState([]);
	const [activeTab, setActiveTab] = useState("personal");
	const [errors, setErrors] = useState({
		personal: {},
		shipping: {},
		billing: {},
	});
	const searchParams = useSearchParams();
	const callbackURL = searchParams.get("callbackUrl") || "/profile";

	const [formData, setFormData] = useState({
		name: session?.user?.name || "",
		phoneNumber: "",
		gender: "",
		dateOfBirth: "",
		shippingAddress: {
			province: "",
			district: "",
			city: "",
			street: "",
			ZIP: "",
		},
		billingAddress: {
			province: "",
			district: "",
			city: "",
			street: "",
			ZIP: "",
		},
	});

	// Initialize provinces, districts, and cities
	useEffect(() => {
		if (session) {
			setPreviewImage(session.user.profilePic);
			setFormData((prev) => ({
				...prev,
				name: session.user.name,
			}));
		}
	}, [session]);

	useEffect(() => {
		setProvinces(getProvinces());
		setDistricts(getDistricts());
		setCities(getCities());
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Handle nested form data
		if (
			name.startsWith("shippingAddress") ||
			name.startsWith("billingAddress")
		) {
			const [addressType, field] = name.split(".");
			setFormData((prev) => ({
				...prev,
				[addressType]: {
					...prev[addressType],
					[field]: value,
				},
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			alert("Image must be less than 5MB");
			return;
		}

		setProfileImage(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const useSameAddress = () => {
		setFormData((prev) => ({
			...prev,
			billingAddress: {
				...prev.shippingAddress,
			},
		}));
	};

	const validatePersonalTab = () => {
		const newErrors = {};
		if (!formData.name) newErrors.name = "Full Name is required";
		if (!formData.phoneNumber)
			newErrors.phoneNumber = "Phone Number is required";
		setErrors((prev) => ({ ...prev, personal: newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const validateShippingTab = () => {
		const newErrors = {};
		if (!formData.shippingAddress.street)
			newErrors.street = "Street Address is required";
		if (!formData.shippingAddress.province)
			newErrors.province = "Province is required";
		if (!formData.shippingAddress.district)
			newErrors.district = "District is required";
		if (!formData.shippingAddress.city) newErrors.city = "City is required";
		if (!formData.shippingAddress.ZIP)
			newErrors.ZIP = "ZIP/Postal Code is required";
		setErrors((prev) => ({ ...prev, shipping: newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const validateBillingTab = () => {
		const newErrors = {};
		if (!formData.billingAddress.street)
			newErrors.street = "Street Address is required";
		if (!formData.billingAddress.province)
			newErrors.province = "Province is required";
		if (!formData.billingAddress.district)
			newErrors.district = "District is required";
		if (!formData.billingAddress.city) newErrors.city = "City is required";
		if (!formData.billingAddress.ZIP)
			newErrors.ZIP = "ZIP/Postal Code is required";
		setErrors((prev) => ({ ...prev, billing: newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const handleNextTab = (nextTab) => {
		let isValid = true;
		switch (activeTab) {
			case "personal":
				isValid = validatePersonalTab();
				break;
			case "shipping":
				isValid = validateShippingTab();
				break;
			case "billing":
				isValid = validateBillingTab();
				break;
			default:
				break;
		}

		if (isValid) {
			setActiveTab(nextTab);
		}
	};

	const handlePreviousTab = (previousTab) => {
		setActiveTab(previousTab);
	};

	const handleDateSelect = (date) => {
		setFormData((prev) => ({
			...prev,
			dateOfBirth: date,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formDataToSend = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				if (typeof value === "object" && value !== null) {
					formDataToSend.append(key, JSON.stringify(value));
				} else {
					formDataToSend.append(key, value);
				}
			});

			if (profileImage) {
				formDataToSend.append("profilePicture", profileImage);
			}

			const result = await updateUserProfile(formDataToSend);

			if (result.success) {
				router.push(callbackURL);
			} else {
				throw new Error(result.error || "Failed to update profile");
			}
		} catch (error) {
			alert(`Error updating profile: ${error.message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (status === "loading") {
		return <Loading />;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
			<Card className="w-full max-w-4xl shadow-lg border-0 overflow-hidden flex flex-col justify-between">
				{/* Header Section */}
				<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
					<div className="space-y-1">
						<h1 className="text-2xl font-bold text-gray-900">
							Complete Your Profile
						</h1>
						<p className="text-sm text-gray-500">
							Tell us more about yourself for a personalized experience
						</p>
					</div>
					<div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
						<Image
							src={previewImage || "/profile.jpg"}
							alt="Profile"
							fill
							className="object-cover"
						/>
					</div>
				</div>

				<Form onSubmit={handleSubmit} className="p-0 h-[60vh]">
					<Tabs
						defaultValue="personal"
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full flex flex-col gap-6 items-center">
						{/* Tab Navigation */}
						<TabsList className="flex justify-between w-max gap-7">
							<TabsTrigger
								value="personal"
								className="data-[state=active]:bg-primary/10 ">
								<Icon icon="mdi:account" width={20} />
								Personal Info
							</TabsTrigger>
							<TabsTrigger
								value="shipping"
								className="data-[state=active]:bg-primary/10 ">
								<Icon icon="mdi:truck-delivery" width={20} />
								Shipping
							</TabsTrigger>
							<TabsTrigger
								value="billing"
								className="data-[state=active]:bg-primary/10 ">
								<Icon icon="mdi:home-city" width={20} />
								Billing
							</TabsTrigger>
						</TabsList>

						{/* Personal Information Tab */}
						<TabsContent value="personal" className="m-0 px-6 pb-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between h-full">
								{/* Profile Picture */}
								<div className="flex flex-col items-center col-end-3 col-span-2">
									<div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
										<div className="relative w-full h-full rounded-full overflow-hidden">
											<Image
												src={previewImage || "/profile.jpg"}
												alt="Profile Preview"
												className="rounded-full object-cover w-full h-full"
												fill
												sizes="100vw"
											/>
											<Label
												htmlFor="profilePicture"
												className="w-full h-full bg-gray-800/50 opacity-0 hover:opacity-80 absolute top-0 left-0 flex items-center justify-center cursor-pointer text-white text-sm font-medium rounded-full transition-all duration-300">
												<Icon
													icon="mdi:camera"
													width={28}
													className="bg-primary p-1.5 rounded-full"
												/>
											</Label>
										</div>
									</div>
									<div className="mt-4 w-full max-w-xs">
										<Input
											id="profilePicture"
											name="profilePicture"
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="hidden"
										/>
									</div>
									<p className="text-xs text-gray-500 mt-2">
										Click on the image to change your profile picture
									</p>
								</div>

								{/* Personal Details */}
								<div className="space-y-2 w-full">
									<Label htmlFor="name" className="text-sm font-medium">
										Full Name <span className="text-red-500">*</span>
									</Label>
									<Input
										id="name"
										name="name"
										placeholder="Your full name"
										value={formData.name}
										onChange={handleChange}
										required
										className="h-10"
									/>
									{errors.personal.name && (
										<p className="text-sm text-red-500">
											{errors.personal.name}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="phoneNumber" className="text-sm font-medium">
										Phone Number <span className="text-red-500">*</span>
									</Label>
									<Input
										id="phoneNumber"
										name="phoneNumber"
										placeholder="Your phone number"
										value={formData.phoneNumber}
										onChange={handleChange}
										className="h-10"
									/>
									{errors.personal.phoneNumber && (
										<p className="text-sm text-red-500">
											{errors.personal.phoneNumber}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="dateOfBirth" className="text-sm font-medium">
										Date of Birth{" "}
										<span className="text-gray-400 text-xs">(optional)</span>
									</Label>
									<DatePicker
										className="w-full h-10"
										onDateChange={handleDateSelect}
									/>
								</div>

								<div className="space-y-3">
									<Label className="text-sm font-medium block">
										Gender{" "}
										<span className="text-gray-400 text-xs">(optional)</span>
									</Label>
									<RadioGroup
										name="gender"
										value={formData.gender}
										onValueChange={(value) =>
											handleChange({ target: { name: "gender", value } })
										}
										className="flex space-x-6">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="male" id="male" />
											<Label htmlFor="male" className="text-sm">
												Male
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="female" id="female" />
											<Label htmlFor="female" className="text-sm">
												Female
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="other" id="other" />
											<Label htmlFor="other" className="text-sm">
												Other
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div className="md:col-span-2 flex justify-end mt-4">
									<Button
										type="button"
										onClick={() => handleNextTab("shipping")}
										className="flex items-center gap-2 py-2 px-4">
										Continue <Icon icon="mdi:arrow-right" width={18} />
									</Button>
								</div>
							</div>
						</TabsContent>

						{/* Shipping Address Tab */}
						<TabsContent value="shipping" className="p-6 w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2 space-y-2">
									<Label
										htmlFor="shippingAddress.street"
										className="text-sm font-medium">
										Street Address <span className="text-red-500">*</span>
									</Label>
									<Input
										id="shippingAddress.street"
										name="shippingAddress.street"
										value={formData.shippingAddress.street}
										placeholder="Street, apt, unit, etc."
										onChange={handleChange}
										required
										className="h-10"
									/>
									{errors.shipping.street && (
										<p className="text-sm text-red-500">
											{errors.shipping.street}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="shippingAddress.province"
										className="text-sm font-medium">
										Province <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="shippingAddress.province"
										name="shippingAddress.province"
										label={
											formData.shippingAddress.province || "Select Province"
										}
										onValueChange={(value) => {
											handleChange({
												target: { name: "shippingAddress.province", value },
											});
											setDistricts(getDistricts(value));
										}}
										options={provinces.map((province) => ({
											value: province,
											label: province,
										}))}
										required
										className="h-10"
									/>
									{errors.shipping.province && (
										<p className="text-sm text-red-500">
											{errors.shipping.province}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="shippingAddress.district"
										className="text-sm font-medium">
										District <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="shippingAddress.district"
										name="shippingAddress.district"
										label={
											formData.shippingAddress.district || "Select District"
										}
										onValueChange={(value) => {
											handleChange({
												target: { name: "shippingAddress.district", value },
											});
											setCities(
												getCities(formData.shippingAddress.province, value),
											);
										}}
										options={districts.map((district) => ({
											value: district.toString(),
											label: district.toString(),
										}))}
										required
										className="h-10"
									/>
									{errors.shipping.district && (
										<p className="text-sm text-red-500">
											{errors.shipping.district}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="shippingAddress.city"
										className="text-sm font-medium">
										City <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="shippingAddress.city"
										name="shippingAddress.city"
										label={
											formData.shippingAddress.city || "Select City or Place"
										}
										onValueChange={(value) => {
											handleChange({
												target: { name: "shippingAddress.city", value },
											});
										}}
										options={cities.map((city) => ({
											value: city,
											label: city,
										}))}
										required
										className="h-10"
									/>
									{errors.shipping.city && (
										<p className="text-sm text-red-500">
											{errors.shipping.city}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="shippingAddress.ZIP"
										className="text-sm font-medium">
										ZIP/Postal Code <span className="text-red-500">*</span>
									</Label>
									<Input
										id="shippingAddress.ZIP"
										name="shippingAddress.ZIP"
										placeholder="ZIP/Postal code"
										value={formData.shippingAddress.ZIP}
										onChange={handleChange}
										required
										className="h-10"
									/>
									{errors.shipping.ZIP && (
										<p className="text-sm text-red-500">
											{errors.shipping.ZIP}
										</p>
									)}
								</div>

								<div className="md:col-span-2 flex justify-between mt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => handlePreviousTab("personal")}
										className="flex items-center gap-2 py-2 px-4">
										<Icon icon="mdi:arrow-left" width={18} /> Back
									</Button>
									<Button
										type="button"
										onClick={() => handleNextTab("billing")}
										className="flex items-center gap-2 py-2 px-4">
										Continue <Icon icon="mdi:arrow-right" width={18} />
									</Button>
								</div>
							</div>
						</TabsContent>

						{/* Billing Address Tab */}
						<TabsContent value="billing" className="p-6 w-full">
							<div className="flex items-center justify-end mb-4">
								<div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-md">
									<Checkbox id="sameAddress" onCheckedChange={useSameAddress} />
									<Label
										htmlFor="sameAddress"
										className="text-sm cursor-pointer">
										Same as shipping
									</Label>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2 space-y-2">
									<Label
										htmlFor="billingAddress.street"
										className="text-sm font-medium">
										Street Address <span className="text-red-500">*</span>
									</Label>
									<Input
										id="billingAddress.street"
										name="billingAddress.street"
										value={formData.billingAddress.street}
										placeholder="Street, apt, unit, etc."
										onChange={handleChange}
										required
										className="h-10"
									/>
									{errors.billing.street && (
										<p className="text-sm text-red-500">
											{errors.billing.street}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="billingAddress.province"
										className="text-sm font-medium">
										Province <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="billingAddress.province"
										name="billingAddress.province"
										label={
											formData.billingAddress.province || "Select Province"
										}
										value={formData.billingAddress.province}
										onValueChange={(value) => {
											handleChange({
												target: { name: "billingAddress.province", value },
											});
											setDistricts(getDistricts(value));
										}}
										options={provinces.map((province) => ({
											value: province,
											label: province,
										}))}
										required
										className="h-10"
									/>
									{errors.billing.province && (
										<p className="text-sm text-red-500">
											{errors.billing.province}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="billingAddress.district"
										className="text-sm font-medium">
										District <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="billingAddress.district"
										name="billingAddress.district"
										label={
											formData.billingAddress.district || "Select District"
										}
										value={formData.billingAddress.district}
										onValueChange={(value) => {
											handleChange({
												target: { name: "billingAddress.district", value },
											});
											setCities(
												getCities(formData.billingAddress.province, value),
											);
										}}
										options={districts.map((district) => ({
											value: district.toString(),
											label: district.toString(),
										}))}
										required
										className="h-10"
									/>
									{errors.billing.district && (
										<p className="text-sm text-red-500">
											{errors.billing.district}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="billingAddress.city"
										className="text-sm font-medium">
										City <span className="text-red-500">*</span>
									</Label>
									<SelectComponent
										id="billingAddress.city"
										name="billingAddress.city"
										label={
											formData.billingAddress.city || "Select City or Place"
										}
										value={formData.billingAddress.city}
										onValueChange={(value) => {
											handleChange({
												target: { name: "billingAddress.city", value },
											});
										}}
										options={cities.map((city) => ({
											value: city,
											label: city,
										}))}
										required
										className="h-10"
									/>
									{errors.billing.city && (
										<p className="text-sm text-red-500">
											{errors.billing.city}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="billingAddress.ZIP"
										className="text-sm font-medium">
										ZIP/Postal Code <span className="text-red-500">*</span>
									</Label>
									<Input
										id="billingAddress.ZIP"
										name="billingAddress.ZIP"
										placeholder="ZIP/Postal code"
										value={formData.billingAddress.ZIP}
										onChange={handleChange}
										required
										className="h-10"
									/>
									{errors.billing.ZIP && (
										<p className="text-sm text-red-500">{errors.billing.ZIP}</p>
									)}
								</div>

								<div className="md:col-span-2 flex justify-between mt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => handlePreviousTab("shipping")}
										className="flex items-center gap-2 py-2 px-4">
										<Icon icon="mdi:arrow-left" width={18} /> Back
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="flex items-center gap-2 py-2 px-4">
										{isSubmitting ? (
											<span className="flex items-center gap-2">
												<span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
												Saving...
											</span>
										) : (
											<span className="flex items-center gap-1">
												Complete Profile <Icon icon="mdi:check" width={18} />
											</span>
										)}
									</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</Form>

				{/* Footer Section */}
				<div className="flex items-center justify-between px-6 py-4 mt-2 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 rounded-b-lg">
					<p className="flex items-center gap-2">
						<Icon icon="mdi:shield-check" className="text-primary" width={16} />
						Your information is securely encrypted
					</p>
					<Link href="/contact" className="text-primary hover:underline">
						Need help?
					</Link>
				</div>
			</Card>
		</div>
	);
}
