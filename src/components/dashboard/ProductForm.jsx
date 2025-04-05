"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Form from "next/form";

export default function ProductForm({
	productFormData,
	handleInputChange,
	imagePreview,
	onSubmit,
}) {
	const [image, setImage] = useState(imagePreview || null);

	// Handle image upload
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
				handleInputChange({
					target: {
						name: "image",
						value: {
							name: file.name,
							type: file.type,
							data: reader.result.split(",")[1],
						},
					},
				});
			};
			reader.readAsDataURL(file);
		}
	};

	// Remove image
	const removeImage = () => {
		setImage(null);
		handleInputChange({ target: { name: "image", value: "" } });
	};

	return (
		<Form
			className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
			action={onSubmit}>
			{/* Image Upload Section */}
			<div className="flex flex-col gap-4">
				<div className="bg-gray-100 rounded-lg p-2 flex flex-col items-center justify-center w-70 h-full">
					{image ? (
						<div className="relative group h-full w-full rounded-lg overflow-hidden shadow-md">
							<Image src={image} alt="Product" fill className="object-cover" />
							<div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									type="button"
									onClick={removeImage}
									className="p-2 bg-white text-red-600 rounded-full shadow-md">
									<Icon icon="mdi:trash" className="h-5 w-5" />
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center gap-3 w-full">
							<p className="text-sm text-gray-500">No image uploaded</p>
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
									onChange={handleImageUpload}
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

				<div className="flex flex-col gap-2">
					<Label htmlFor="category" className="text-sm font-medium">
						Category <span className="text-red-500">*</span>
					</Label>
					<Input
						id="category"
						name="category"
						value={productFormData.category}
						onChange={handleInputChange}
						placeholder="Enter product category"
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
				<Button type="submit">Submit</Button>
			</div>
		</Form>
	);
}
