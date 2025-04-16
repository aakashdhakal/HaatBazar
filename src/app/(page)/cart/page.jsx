"use client";

import { useEffect, useState, useCallback, use } from "react";
import CartProduct from "@/components/CartProduct";
import { getCart, clearCart } from "@/app/(server)/actions/cart";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { createOrder } from "@/app/(server)/actions/order";
import { initiateKhaltiPayment } from "@/app/(server)/actions/payment";
import {
	fetchBillingAddress,
	fetchShippingAddress,
} from "@/app/(server)/actions/users";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { hashData, formatAddress } from "@/lib/utils";
import SelectComponent from "@/components/Select";
import { useToast } from "@/hooks/use-toast";
import { DialogComponent } from "@/components/DialogComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { createPayment } from "@/app/(server)/actions/payment";
import { useSession } from "next-auth/react";

export default function Cart() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const { cartItems, setCartItems } = useCart({});

	const [totalPrice, setTotalPrice] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState("esewa");
	const shippingFee = totalPrice >= 500 ? 0 : 50;
	const [loading, setLoading] = useState({
		page: true,
		checkout: false,
		addresses: true,
	});
	const [address, setAddress] = useState({
		shippingAddress: [],
		billingAddress: [],
	});
	const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
	const [selectedBillingAddress, setSelectedBillingAddress] = useState("");
	const [tempShippingAddress, setTempShippingAddress] = useState("");
	const [tempBillingAddress, setTempBillingAddress] = useState("");
	const { toast } = useToast();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);
	// Fetch cart items
	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const cartData = await getCart();
				setCartItems(cartData);
			} catch (error) {
				console.error("Failed to fetch cart items:", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to load your cart. Please try again.",
				});
			} finally {
				setLoading((prev) => ({ ...prev, page: false }));
			}
		};
		fetchCartItems();
	}, [setCartItems, toast]);

	// Calculate total price whenever cart items change
	useEffect(() => {
		const calculateTotalPrice = () => {
			let total = 0;
			if (Array.isArray(cartItems)) {
				cartItems.forEach((item) => {
					total += item.price * item.quantity;
				});
			}
			setTotalPrice(total);
		};

		calculateTotalPrice();
	}, [cartItems]);

	// Fetch addresses only once on component mount
	useEffect(() => {
		const fetchAddresses = async () => {
			setLoading((prev) => ({ ...prev, addresses: true }));
			try {
				const shippingAddresses = JSON.parse(await fetchShippingAddress());
				const billingAddresses = JSON.parse(await fetchBillingAddress());

				const formattedShippingAddresses = shippingAddresses.map(formatAddress);
				const formattedBillingAddresses = billingAddresses.map(formatAddress);

				setAddress({
					shippingAddress: formattedShippingAddresses,
					billingAddress: formattedBillingAddresses,
				});

				if (formattedShippingAddresses.length > 0) {
					setSelectedShippingAddress(formattedShippingAddresses[0]);
					setTempShippingAddress(formattedShippingAddresses[0]);
				}

				if (formattedBillingAddresses.length > 0) {
					setSelectedBillingAddress(formattedBillingAddresses[0]);
					setTempBillingAddress(formattedBillingAddresses[0]);
				}
			} catch (error) {
				console.error("Failed to fetch addresses:", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to load your addresses.",
				});
			} finally {
				setLoading((prev) => ({ ...prev, addresses: false }));
			}
		};

		fetchAddresses();
		// Empty dependency array ensures this runs only once on mount
	}, [toast]);

	// Handle remove item from cart
	const handleRemove = useCallback(
		(productId) => {
			setCartItems((prevItems) =>
				prevItems.filter((item) => item._id !== productId),
			);
		},
		[setCartItems],
	);

	// Handle checkout process
	const handleCheckout = async () => {
		setLoading({
			...loading,
			checkout: true,
		});
		const transactionUuid = Math.floor(Math.random() * 1000000);
		const totalAmount = totalPrice + shippingFee;
		try {
			const paymentResponse = await createPayment({
				transactionId: transactionUuid,
				amount: {
					product: totalPrice,
					shipping: shippingFee,
					total: totalAmount,
				},
				paymentMethod,
			});

			const orderResponse = await createOrder({
				products: cartItems.map((item) => ({
					product: item._id,
					quantity: item.quantity,
					price: item.price,
				})),
				billingAddress: selectedBillingAddress,
				shippingAddress: selectedShippingAddress,
				totalAmount,
				paymentInfo: paymentResponse._id,
			});
			if (!orderResponse) {
				throw new Error("Error placing order");
			}

			// Process payment based on selected method
			switch (paymentMethod) {
				case "esewa":
					const signature = hashData(
						`total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`,
					);
					const form = document.createElement("form");
					form.method = "POST";
					form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
					const fields = {
						amount: totalAmount,
						failure_url: "http://localhost:3000/cart",
						product_delivery_charge: 0,
						product_service_charge: 0,
						product_code: "EPAYTEST",
						signature: signature,
						signed_field_names: "total_amount,transaction_uuid,product_code",
						success_url: "http://localhost:3000/orders",
						tax_amount: 0,
						total_amount: totalAmount,
						transaction_uuid: transactionUuid,
					};
					Object.entries(fields).forEach(([key, value]) => {
						const input = document.createElement("input");
						input.type = "hidden";
						input.name = key;
						input.value = value;
						form.appendChild(input);
					});
					document.body.appendChild(form);
					form.submit();
					break;
				case "khalti":
					await initiateKhaltiPayment({
						amount: totalPrice,
						transactionUuid,
						products: cartItems,
						shipping: shippingFee,
						billingAddress: selectedBillingAddress,
						shippingAddress: selectedShippingAddress,
					});
					break;
				case "cash":
					router.push("/order-confirmation");
					break;
			}
		} catch (error) {
			console.error("Error during checkout:", error);
		} finally {
			setLoading(false);
		}
	};

	// Clear cart
	const handleClearCart = useCallback(async () => {
		try {
			await clearCart();
			setCartItems([]);
			toast({
				title: "Cart cleared",
				description: "Your cart has been cleared successfully",
			});
		} catch (error) {
			console.error("Error clearing cart", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to clear your cart.",
			});
		}
	}, [setCartItems, toast]);

	// Save address
	const handleSaveAddress = () => {
		setSelectedShippingAddress(tempShippingAddress);
		setSelectedBillingAddress(tempBillingAddress);
	};

	// Empty cart view
	if (!loading.page && (!cartItems || cartItems.length === 0)) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4">
				<div className="flex flex-col items-center gap-6">
					<div className="text-primary/80">
						<Icon icon="mdi:cart-outline" className="w-24 h-24" />
					</div>
					<div className="flex flex-col items-center gap-2">
						<h1 className="text-2xl font-bold text-gray-900">
							Your cart is empty
						</h1>
						<p className="text-gray-500 text-center max-w-md">
							Looks like you haven&apos;t added any items to your cart yet.
							Browse our products and start shopping!
						</p>
					</div>
					<Link href="/">
						<Button className="bg-primary hover:bg-primary-dark text-white">
							Continue Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// Loading skeleton
	// Loading skeleton with Shadcn UI Skeleton
	if (loading.page) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<Skeleton className="h-8 w-36 mb-6" />
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="w-full lg:w-2/3">
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
							<Skeleton className="h-12 w-full" />
							<div className="p-4 flex flex-col gap-4">
								{[1, 2].map((i) => (
									<div key={i} className="flex gap-4">
										<Skeleton className="w-16 h-16 rounded-md" />
										<div className="flex-1 flex flex-col gap-2">
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-4 w-1/2" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="w-full lg:w-1/3">
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<Skeleton className="h-6 w-1/3 mb-4" />
							<div className="flex flex-col gap-4">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} className="h-4 w-full" />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold text-gray-900 pb-6">Shopping Cart</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Cart Items Section */}
				<div className="w-full lg:w-2/3 flex flex-col gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<div className="bg-primary/10 p-4 border-b border-gray-100">
							<div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
								<div className="col-span-5 md:col-span-6">Product</div>
								<div className="col-span-3 md:col-span-2 text-center">
									Quantity
								</div>
								<div className="col-span-2 md:col-span-2 text-right">Total</div>
								<div className="col-span-2 md:col-span-2 text-right">
									Action
								</div>
							</div>
						</div>

						<div className="divide-y divide-gray-100">
							{cartItems.map((product) => (
								<CartProduct
									key={product._id}
									product={product}
									onRemove={handleRemove}
								/>
							))}
						</div>
					</div>

					<div className="flex justify-between items-center flex-wrap gap-4">
						<Link href="/">
							<Button
								variant="outline"
								className="flex items-center gap-2 text-sm">
								<Icon icon="mdi:arrow-left" className="w-4 h-4" />
								Continue Shopping
							</Button>
						</Link>
						{totalPrice < 500 && (
							<div className="text-sm text-secondary text-center">
								Add Rs {500 - totalPrice} more for free shipping
							</div>
						)}
						<Button
							variant="destructive"
							className="flex items-center gap-2 text-sm"
							onClick={handleClearCart}>
							<Icon icon="mdi:delete" className="w-4 h-4" />
							Clear Cart
						</Button>
					</div>
				</div>

				{/* Order Summary Section */}
				<div className="w-full lg:w-1/3">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 flex flex-col gap-6">
						<h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

						<div className="flex flex-col gap-4">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-medium">Rs {totalPrice}</span>
							</div>

							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Shipping</span>
								<span className="font-medium">
									{shippingFee === 0 ? (
										<span className="text-primary">FREE</span>
									) : (
										`Rs ${shippingFee}`
									)}
								</span>
							</div>

							<Separator />

							<div className="flex justify-between">
								<span className="font-medium text-gray-900">Total</span>
								<span className="font-bold text-lg text-gray-900">
									Rs {totalPrice + shippingFee}
								</span>
							</div>
						</div>

						{/* Shipping Address Section */}
						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center">
								<h3 className="text-sm font-medium text-gray-700">
									Delivery Address
								</h3>
								<DialogComponent
									triggerText="Change Address" // No trigger - we control opening separately
									varient="link"
									title="Select Address"
									description="Select the delivery and billing address for your order"
									content={
										<div className="flex flex-col gap-6 py-2 max-w-full">
											<div className="w-full flex flex-col gap-2">
												<Label
													htmlFor="shippingAddress"
													className="text-sm font-medium">
													Shipping Address
												</Label>
												<SelectComponent
													label="Shipping Address"
													options={address.shippingAddress.map((addr) => ({
														label: addr,
														value: addr,
													}))}
													value={tempShippingAddress}
													onValueChange={setTempShippingAddress}
												/>
											</div>
											<div className="flex flex-col gap-2">
												<Label
													htmlFor="billingAddress"
													className="text-sm font-medium">
													Billing Address
												</Label>
												<SelectComponent
													label="Billing Address"
													options={address.billingAddress.map((addr) => ({
														label: addr,
														value: addr,
													}))}
													value={tempBillingAddress}
													onValueChange={setTempBillingAddress}
												/>
											</div>
										</div>
									}
									action={handleSaveAddress}
									actionLabel="Save Address"
									className=" xl:max-w-[25vw]"
								/>
							</div>

							<div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-100">
								{loading.addresses ? (
									<Skeleton className="h-4 w-full" />
								) : selectedShippingAddress ? (
									<p className="text-gray-600 whitespace-normal break-words">
										{selectedShippingAddress}
									</p>
								) : (
									<p className="text-secondary">
										Please select a shipping address
									</p>
								)}
							</div>
						</div>

						{/* Payment Methods */}
						<div className="flex flex-col gap-3">
							<h3 className="text-sm font-medium text-gray-700">
								Payment Method
							</h3>

							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
								className="flex flex-col gap-2">
								{[
									{ id: "esewa", label: "eSewa", image: "/esewa.png" },
									{ id: "khalti", label: "Khalti", image: "/khalti.png" },
									{
										id: "cash",
										label: "Cash on Delivery",
										image: "/cod.png",
									},
								].map((method) => (
									<div
										key={method.id}
										className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
											paymentMethod === method.id
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:bg-gray-50"
										}`}>
										<RadioGroupItem
											id={method.id}
											value={method.id}
											className="mr-3"
										/>
										<Label
											htmlFor={method.id}
											className="flex items-center justify-between w-full cursor-pointer">
											<span>{method.label}</span>
											<Image
												src={method.image}
												width={40}
												height={20}
												alt={method.label}
												className="object-contain"
											/>
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>

						{/* Checkout Button */}
						<Button
							className="w-full bg-primary hover:bg-primary-dark text-white h-12"
							onClick={handleCheckout}
							disabled={loading.checkout || !selectedShippingAddress}
							isLoading={loading.checkout}
							loadingtext="Processing Order">
							Checkout
						</Button>

						<p className="text-xs text-gray-500 text-center">
							By proceeding, you agree to our
							<Link href="/terms" className="text-primary hover:underline mx-1">
								Terms
							</Link>
							and
							<Link
								href="/privacy"
								className="text-primary hover:underline ml-1">
								Privacy Policy
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Address Selection Dialog - Moved outside the main content */}
		</div>
	);
}
