"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import SelectComponent from "../Select";

export default function ProductForm({
	productFormData,
	handleInputChange,
	imagePreview,
	onSubmit,
	handleImageUpload,
	loading,
}) {
	const [image, setImage] = useState(imagePreview || null);

	// Predefined categories
	const categories = [
		{ label: "Vegetables", value: "Vegetables" },
		{ label: "Fruits", value: "Fruits" },
		{ label: "Dairy", value: "Dairy" },
		{ label: "Bakery", value: "Bakery" },
		{ label: "Beverages", value: "Beverages" },
		{ label: "Snacks", value: "Snacks" },
		{ label: "Pantry", value: "Pantry" },
		{ label: "Meat & Seafood", value: "Meat & Seafood" },
		{ label: "Frozen Foods", value: "Frozen Foods" },
		{ label: "Personal Care", value: "Personal Care" },
		{ label: "Household", value: "Household" },
	];

	// Handle image upload
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file)); // Preview the image
			handleImageUpload(file); // Pass the file to the parent component
		}
	};

	// Remove image
	const removeImage = () => {
		setImage(null);
		handleImageUpload(null); // Clear the image in the parent component
	};

	// Handle category selection and format it correctly for the parent component
	const handleCategoryChange = (value) => {
		handleInputChange({
			target: {
				name: "category",
				value: value,
			},
		});
	};

	return (
		<Form
			className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
			onSubmit={onSubmit}>
			{/* Image Upload Section */}
			<div className="flex flex-col gap-4">
				<div className="bg-muted rounded-lg p-2 flex flex-col items-center justify-center w-70 h-full">
					{image ? (
						<div className="relative group h-full w-full rounded-lg overflow-hidden shadow-md">
							<Image src={image} alt="Product" fill className="object-cover" />
							<div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									type="button"
									onClick={removeImage}
									className="p-2 bg-background text-red-600 rounded-full shadow-md">
									<Icon icon="mdi:trash" className="h-5 w-5" />
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center gap-3 w-full">
							<p className="text-sm text-muted-foreground">No image uploaded</p>
							<Label
								htmlFor="image-upload"
								className="cursor-pointer flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-md">
								<Icon icon="mdi:plus" className="h-5 w-5" />
								Upload Image
								<Input
									id="image-upload"
									name="image"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange} // Correctly handle the file input
								/>
							</Label>
						</div>
					)}
				</div>
			</div>

			{/* Product Details */}
			<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Required Fields */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="name" className="text-sm font-medium">
						Product Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="name"
						name="name"
						value={productFormData.name}
						onChange={handleInputChange}
						placeholder="Enter product name"
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="price" className="text-sm font-medium">
						Price (Rs.) <span className="text-red-500">*</span>
					</Label>
					<Input
						id="price"
						name="price"
						type="number"
						value={productFormData.price}
						onChange={handleInputChange}
						placeholder="0.00"
						required
						min="0"
						step="0.01"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="countInStock" className="text-sm font-medium">
						Stock <span className="text-red-500">*</span>
					</Label>
					<Input
						id="countInStock"
						name="countInStock"
						type="number"
						value={productFormData.countInStock}
						onChange={handleInputChange}
						placeholder="0"
						required
						min="0"
						step="1"
					/>
				</div>

				{/* REPLACED: Category input with select dropdown */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="category" className="text-sm font-medium">
						Category <span className="text-red-500">*</span>
					</Label>
					<SelectComponent
						label="Select category"
						options={categories}
						value={productFormData.category}
						onValueChange={handleCategoryChange}
						required
					/>
				</div>

				{/* Optional Fields */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="brand" className="text-sm font-medium">
						Brand
					</Label>
					<Input
						id="brand"
						name="brand"
						value={productFormData.brand}
						onChange={handleInputChange}
						placeholder="Enter product brand"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="quantityPrice" className="text-sm font-medium">
						Quantity/Unit Price
					</Label>
					<Input
						id="quantityPrice"
						name="quantityPrice"
						value={productFormData.quantityPrice}
						onChange={handleInputChange}
						placeholder="Enter price per unit"
					/>
				</div>

				{/* Description - Full Width */}
				<div className="md:col-span-2 flex flex-col gap-2">
					<Label htmlFor="description" className="text-sm font-medium">
						Description <span className="text-red-500">*</span>
					</Label>
					<Textarea
						id="description"
						name="description"
						value={productFormData.description}
						onChange={handleInputChange}
						className="resize-none"
						rows={4}
						placeholder="Describe the product features..."
						required
					/>
				</div>
			</div>

			{/* Submit Button */}
			<div className="md:col-span-3 flex justify-end">
				<Button type="submit" isLoading={loading} loadingtext="Adding Product">
					Submit
				</Button>
			</div>
		</Form>
	);
}
