"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import SelectComponent from "@/components/Select";
import { DialogComponent } from "@/components/DialogComponent";
import AlertDialogComponent from "@/components/AlertDialog";
import ProductForm from "@/components/dashboard/ProductForm";
import InfoCard from "@/components/dashboard/InfoCard";

// Server Actions
import getAllProducts, {
	createProduct,
	updateProduct,
	deleteProduct,
	uploadProductImage,
} from "@/app/(server)/actions/products";

export default function ProductsManagement() {
	const router = useRouter();
	const { toast } = useToast();

	// State
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [categories, setCategories] = useState([]);
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [stockFilter, setStockFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [showProductDialog, setShowProductDialog] = useState(false);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [productFormData, setProductFormData] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		countInStock: "",
		image: "",
		brand: "",
		quantityPrice: "",
	});
	const [imagePreview, setImagePreview] = useState("");

	// Constants
	const itemsPerPage = 8;

	// Fetch products on mount and page change
	useEffect(() => {
		fetchProducts();
	}, [page]);

	// Fetch products from API
	const fetchProducts = async () => {
		setLoading(true);
		try {
			const data = await getAllProducts();
			if (data) {
				setProducts(Array.isArray(data) ? data : []);
				const uniqueCategories = [...new Set(data.map((p) => p.category))];
				setCategories(uniqueCategories.filter(Boolean));
			}
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Failed to fetch products",
			});
		} finally {
			setLoading(false);
		}
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Open product dialog for create/edit
	const openProductDialog = (product = null) => {
		if (product) {
			setCurrentProduct(product);
			setProductFormData({
				name: product.name,
				description: product.description,
				price: product.price,
				category: product.category,
				countInStock: product.countInStock,
				image: product.image,
				brand: product.brand,
				quantityPrice: product.quantityPrice,
			});
			setImagePreview(product.image);
		} else {
			setCurrentProduct(null);
			setProductFormData({
				name: "",
				description: "",
				price: "",
				category: "",
				countInStock: "",
				image: "",
				brand: "",
				quantityPrice: "",
			});
			setImagePreview("");
		}
		setShowProductDialog(true);
	};
	const handleProductSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Set loading to true when submission starts
		try {
			const formData = { ...productFormData };

			if (currentProduct) {
				// If editing, update the product
				await updateProduct(currentProduct._id, formData);
				toast({
					title: "Product updated",
					description: "Product has been updated successfully",
					variant: "success",
				});
			} else {
				// If creating, create a new product
				await createProduct(formData);
				toast({
					title: "Product created",
					description: "New product has been created successfully",
					variant: "success",
				});
			}
			setShowProductDialog(false);
			fetchProducts();
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: error.message || "Failed to save product",
			});
		} finally {
			setLoading(false); // Set loading to false after response
		}
	};

	// Pass the handleImageUpload function to ProductForm
	const handleImageUpload = (file) => {
		setProductFormData((prev) => ({
			...prev,
			image: file,
		}));
	};
	// Handle product deletion
	const handleDeleteProduct = async (productId) => {
		try {
			await deleteProduct(productId);
			toast({
				title: "Product deleted",
				description: "Product has been deleted successfully",
				variant: "success",
			});
			fetchProducts();
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Failed to delete product",
			});
		}
	};

	// Handle bulk deletion
	const handleBulkDelete = async () => {
		try {
			await Promise.all(selectedProducts.map((id) => deleteProduct(id)));
			toast({
				title: "Products deleted",
				description: `${selectedProducts.length} products have been deleted`,
				variant: "success",
			});
			setSelectedProducts([]);
			fetchProducts();
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Failed to delete products",
			});
		}
	};

	// Filter and sort products
	const filteredProducts = products
		.filter((product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.filter(
			(product) =>
				categoryFilter === "all" || product.category === categoryFilter,
		)
		.filter((product) => {
			if (stockFilter === "in-stock") return product.countInStock > 0;
			if (stockFilter === "out-of-stock") return product.countInStock === 0;
			return true;
		});

	// Pagination calculation
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const paginatedProducts = filteredProducts.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage,
	);
	const startItem =
		filteredProducts.length > 0 ? (page - 1) * itemsPerPage + 1 : 0;
	const endItem = Math.min(page * itemsPerPage, filteredProducts.length);

	// Dashboard summary cards data
	const summaryCards = [
		{
			title: "Total Products",
			value: products.length.toString(),
			icon: "mdi:package",
			description: "In inventory",
		},
		{
			title: "Categories",
			value: categories.length.toString(),
			icon: "mdi:tag-outline",
			description: "Product types",
		},
		{
			title: "In Stock",
			value: products.filter((p) => p.countInStock > 5).length.toString(),
			icon: "mdi:check-circle-outline",
			description: "Available items",
		},
		{
			title: "Low Stock",
			value: products
				.filter((p) => p.countInStock > 0 && p.countInStock < 10)
				.length.toString(),
			icon: "mdi:alert-circle-outline",
			description: "Need restocking",
			isTrendNegative: true,
		},
	];

	// Toggle product selection
	const toggleProductSelection = (productId) => {
		setSelectedProducts((prev) =>
			prev.includes(productId)
				? prev.filter((id) => id !== productId)
				: [...prev, productId],
		);
	};

	// Toggle all products selection
	const toggleAllProducts = (checked) => {
		if (checked) {
			setSelectedProducts([
				...new Set([
					...selectedProducts,
					...paginatedProducts.map((p) => p._id),
				]),
			]);
		} else {
			setSelectedProducts(
				selectedProducts.filter(
					(id) => !paginatedProducts.find((p) => p._id === id),
				),
			);
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setCategoryFilter("all");
		setStockFilter("all");
	};

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Products</h1>
					<p className="text-muted-foreground">Manage your product inventory</p>
				</div>
				<Button onClick={() => openProductDialog()} className="gap-1">
					<Icon icon="mdi:plus" className="h-4 w-4" />
					Add Product
				</Button>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				{summaryCards.map((card, index) => (
					<InfoCard key={index} {...card} />
				))}
			</div>

			{/* Search and filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-grow">
					<Icon
						icon="mdi:magnify"
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
					/>
					<Input
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
				<div className="flex gap-3">
					<SelectComponent
						label="All Categories"
						value={categoryFilter}
						onValueChange={setCategoryFilter}
						options={[
							{ value: "all", label: "All Categories" },
							...categories.map((category) => ({
								value: category,
								label: category,
							})),
						]}
					/>
					<SelectComponent
						label="All Stock"
						value={stockFilter}
						onValueChange={setStockFilter}
						options={[
							{ value: "all", label: "All Stock" },
							{ value: "in-stock", label: "In Stock" },
							{ value: "out-of-stock", label: "Out of Stock" },
						]}
					/>
				</div>
			</div>

			{/* Bulk action bar */}
			{selectedProducts.length > 0 && (
				<div className="bg-primary/10 p-3 rounded-lg flex items-center justify-between">
					<span className="text-sm font-medium">
						{selectedProducts.length} products selected
					</span>
					<AlertDialogComponent
						varient="destructive"
						size="sm"
						triggerText="Delete Selected"
						alertTitle="Delete multiple products"
						alertDescription={
							<p>
								Are you sure you want to delete {selectedProducts.length}{" "}
								products? This action cannot be undone.
							</p>
						}
						cancelText="Cancel"
						actionText="Delete"
						action={handleBulkDelete}
					/>
				</div>
			)}

			{/* Products list */}
			<div className="space-y-4">
				{/* Table header */}
				<div className="bg-background border rounded-t-lg hidden md:flex items-center">
					<div className="w-10 p-3 flex items-center justify-center">
						<Checkbox
							checked={
								paginatedProducts.length > 0 &&
								selectedProducts.length === paginatedProducts.length
							}
							onCheckedChange={toggleAllProducts}
							aria-label="Select all products"
						/>
					</div>
					<div className="w-16 p-3"></div>
					<div className="flex-1 p-3 text-sm font-medium text-muted-foreground">
						Product
					</div>
					<div className="w-32 p-3 text-sm font-medium text-muted-foreground text-center">
						Price
					</div>
					<div className="w-32 p-3 text-sm font-medium text-muted-foreground text-center">
						Stock
					</div>
					<div className="w-32 p-3 text-sm font-medium text-muted-foreground text-center">
						Category
					</div>
					<div className="w-48 p-3 text-sm font-medium text-muted-foreground text-center">
						Brand
					</div>
					<div className="w-40 p-3 text-sm font-medium text-muted-foreground text-center">
						Quantity Price
					</div>
					<div className="w-32 p-3 text-sm font-medium text-muted-foreground text-center">
						Actions
					</div>
				</div>

				{loading ? (
					// Loading skeletons
					Array.from({ length: itemsPerPage }).map((_, index) => (
						<div
							key={index}
							className="bg-background border rounded-md mb-2 flex flex-col md:flex-row items-center">
							<div className="w-full md:w-10 p-3 flex justify-center">
								<Skeleton className="h-4 w-4 rounded" />
							</div>
							<div className="w-full md:w-16 p-3 flex justify-center">
								<Skeleton className="h-12 w-12 rounded" />
							</div>
							<div className="w-full md:flex-1 p-3">
								<Skeleton className="h-5 w-full max-w-[250px] rounded" />
								<Skeleton className="h-4 w-24 mt-2 rounded" />
							</div>
							<div className="w-full md:w-28 p-3 text-right">
								<Skeleton className="h-5 w-16 ml-auto rounded" />
							</div>
							<div className="w-full md:w-24 p-3 flex justify-center">
								<Skeleton className="h-6 w-16 rounded" />
							</div>
							<div className="w-full md:w-32 p-3">
								<Skeleton className="h-5 w-20 rounded" />
							</div>
							<div className="w-full md:w-24 p-3 flex justify-center">
								<Skeleton className="h-5 w-16 rounded" />
							</div>
							<div className="w-full md:w-32 p-3">
								<Skeleton className="h-5 w-20 rounded" />
							</div>
							<div className="w-full md:w-28 p-3 md:text-right flex justify-end">
								<Skeleton className="h-9 w-20 rounded" />
							</div>
						</div>
					))
				) : filteredProducts.length === 0 ? (
					// Empty state
					<div className="bg-card rounded-lg shadow-sm border p-12 text-center">
						<div className="flex flex-col items-center gap-3">
							<Icon
								icon="mdi:package-variant"
								className="h-12 w-12 text-muted-foreground/50"
							/>
							<h3 className="text-lg font-medium">No products found</h3>
							<p className="text-muted-foreground max-w-md mx-auto">
								{searchQuery ||
								categoryFilter !== "all" ||
								stockFilter !== "all"
									? "Try adjusting your search or filters to find what you're looking for."
									: "Get started by adding your first product to the inventory."}
							</p>
							{(searchQuery ||
								categoryFilter !== "all" ||
								stockFilter !== "all") && (
								<Button
									variant="outline"
									onClick={clearFilters}
									className="mt-2">
									Clear Filters
								</Button>
							)}
						</div>
					</div>
				) : (
					// Product list
					paginatedProducts.map((product) => (
						<div
							key={product._id}
							className={`bg-background border rounded-md mb-2 flex flex-col md:flex-row items-center hover:bg-accent/5 transition-colors ${
								selectedProducts.includes(product._id)
									? "bg-accent/10 border-accent"
									: ""
							}`}>
							{/* Checkbox */}
							<div className="w-full md:w-10 p-3 flex justify-center">
								<Checkbox
									checked={selectedProducts.includes(product._id)}
									onCheckedChange={(checked) =>
										toggleProductSelection(product._id)
									}
									aria-label={`Select ${product.name}`}
								/>
							</div>

							{/* Image */}
							<div className="w-full md:w-16 p-3 flex justify-center">
								<div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted border">
									<SafeImage
										src={product.image}
										alt={product.name}
										type="product"
										fill
										className="object-cover"
										sizes="48px"
									/>
								</div>
							</div>

							{/* Product info */}
							<div className="w-full md:flex-1 p-3">
								<div className="font-medium text-sm md:text-base truncate max-w-xs">
									{product.name}
								</div>
								<div className="text-xs text-muted-foreground mt-1 md:hidden">
									{product.category || "Uncategorized"}
								</div>
								<div className="md:hidden text-xs text-muted-foreground w-32 text-center">
									Rs. {product.price} • {product.countInStock} in stock •{" "}
									{product.brand || "No brand"} • Q.Price:{" "}
									{product.quantityPrice || "N/A"}
								</div>
							</div>

							{/* Price */}
							<div className="hidden md:block w-28 p-3 text-center font-medium">
								Rs. {product.price}
							</div>

							{/* Stock */}
							<div className="hidden md:flex w-32 p-3 justify-center text-center">
								<Badge
									variant={product.countInStock > 5 ? "outline" : "destructive"}
									className={
										product.countInStock > 5
											? "bg-green-50 text-green-700 border-green-200"
											: ""
									}>
									{product.countInStock > 0
										? `${product.countInStock}`
										: "Out of stock"}
								</Badge>
							</div>

							{/* Category */}
							<div className="hidden md:block w-32 p-3 truncate text-center">
								{product.category || "Uncategorized"}
							</div>

							{/* Brand */}
							<div className="hidden md:block w-48 p-3 text-center truncate">
								{product.brand || "No brand"}
							</div>

							{/* Quantity Price */}
							<div className="hidden md:block w-40 p-3 truncate text-center">
								{product.quantityPrice || "N/A"}
							</div>

							{/* Actions */}
							<div className="w-full md:w-32 p-3 flex gap-2 justify-center">
								<Button
									size="sm"
									variant="outline"
									className="text-muted-foreground hover:text-foreground"
									onClick={() => openProductDialog(product)}>
									<Icon icon="mdi:pencil" className="h-4 w-4" />
									<span className="sr-only">Edit</span>
								</Button>

								<AlertDialogComponent
									varient="destructive"
									size="sm"
									triggerClassName="text-muted-foreground hover:text-destructive"
									triggerText={<Icon icon="mdi:delete" className="h-4 w-4" />}
									alertTitle="Delete product"
									alertDescription={
										<p>
											Are you sure you want to delete{" "}
											<strong>{product.name}</strong>? This action cannot be
											undone.
										</p>
									}
									cancelText="Cancel"
									actionText="Delete"
									action={() => handleDeleteProduct(product._id)}
								/>
							</div>
						</div>
					))
				)}

				{/* Mobile view note */}
				<div className="md:hidden text-xs text-muted-foreground text-center mt-2">
					Swipe horizontally to see more details
				</div>
			</div>

			{/* Pagination */}
			{!loading && filteredProducts.length > 0 && (
				<div className="flex justify-between items-center py-4">
					<div className="text-sm text-muted-foreground">
						Showing {startItem} to {endItem} of {filteredProducts.length}{" "}
						products
					</div>
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(Math.max(1, page - 1))}
							disabled={page === 1}>
							<Icon icon="mdi:chevron-left" className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-1 px-2">
							<span className="text-sm font-medium">{page}</span>
							<span className="text-sm text-muted-foreground">
								of {totalPages || 1}
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(Math.min(totalPages, page + 1))}
							disabled={page === totalPages || totalPages === 0}>
							<Icon icon="mdi:chevron-right" className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Product Form Dialog */}
			{showProductDialog && (
				<DialogComponent
					className=" min-w-[50vw]"
					open={showProductDialog}
					onClose={() => setShowProductDialog(false)}
					title={currentProduct ? "Edit Product" : "Add New Product"}
					description={`${
						currentProduct ? "Update" : "Create"
					} your product details`}
					content={
						<ProductForm
							productFormData={productFormData}
							handleInputChange={handleInputChange}
							imagePreview={imagePreview}
							onSubmit={handleProductSubmit}
							handleImageUpload={handleImageUpload} // Pass the function directly
							loading={loading} // Pass loading state
						/>
					}
				/>
			)}
		</div>
	);
}
