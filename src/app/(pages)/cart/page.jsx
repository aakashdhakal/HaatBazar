"use client";
import { useEffect, useState } from "react";
import CartProduct from "@/components/CartProduct";
import { getCart } from "@/app/(server)/actions/cart";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { createOrder } from "@/app/(server)/actions/order";
import { initiateKhaltiPayment } from "@/app/(server)/actions/payment";
import { fetchUserAddress } from "@/app/(server)/actions/users";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { HmacSHA256 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";

const hash = (message) => {
	const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;
	return Base64.stringify(HmacSHA256(message, secretKey));
};

const decodeData = (data) => {
	const decoded = JSON.parse(atob(data));
	return decoded;
};

export default function Cart() {
	const router = useRouter();
	const parameters = useSearchParams();
	const encodedData = parameters.get("data");
	const khaltiData = parameters.getAll("khalti");

	useEffect(() => {
		if (encodedData) {
			const payment = decodeData(encodedData);
			if (payment.status === "COMPLETE") {
				// Handle successful payment
			}
		}
	}, [encodedData]);

	const { cartItems, setCartItems } = useCart({});
	const [totalPrice, setTotalPrice] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState("esewa");
	const shippingFee = totalPrice >= 500 ? 0 : 50;
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState({
		shippingAddress: [],
		billingAddress: [],
	});
	const [shippingAddress, setShippingAddress] = useState("");
	const [billingAddress, setBillingAddress] = useState("");
	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

	useEffect(() => {
		const fetchCartItems = async () => {
			setCartItems(await getCart());
		};
		fetchCartItems();
	}, [setCartItems]);

	useEffect(() => {
		let total = 0;
		if (Array.isArray(cartItems)) {
			// Add this check
			cartItems.forEach((item) => {
				total += item.price * item.quantity;
			});
		}
		setTotalPrice(total);

		const fetchAddress = async () => {
			const address = await fetchUserAddress();
			setAddress(address);
			if (address.shippingAddress.length > 0) {
				setShippingAddress(address.shippingAddress[0]);
			}
			if (address.billingAddress.length > 0) {
				setBillingAddress(address.billingAddress[0]);
			}
		};
		fetchAddress();
	}, [cartItems]);

	const handleRemove = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item._id !== productId),
		);
	};

	const handleCheckout = async () => {
		if (!shippingAddress || !billingAddress) {
			setIsAddressModalOpen(true);
			return;
		}

		setLoading(true);
		const transactionUuid = Math.floor(Math.random() * 1000000);
		const totalAmount = totalPrice + shippingFee;

		try {
			const orderResponse = await createOrder({
				products: cartItems.map((item) => ({
					productId: item._id,
					quantity: item.quantity,
					price: item.price,
				})),
				billingAddress,
				shippingAddress,
				totalAmount,
			});

			if (!orderResponse) {
				throw new Error("Error placing order");
			}

			// Process payment based on selected method
			switch (paymentMethod) {
				case "esewa":
					const signature = hash(
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
						shippingAddress,
						billingAddress,
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

	// If cart is empty
	if (!cartItems.length) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4">
				<div className="text-primary/80 mb-6">
					<Icon icon="mdi:cart-outline" className="w-24 h-24" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Your cart is empty
				</h1>
				<p className="text-gray-500 mb-8 text-center max-w-md">
					Looks like you haven&apos;t added any items to your cart yet. Browse
					our products and start shopping!
				</p>
				<Link href="/">
					<Button className="bg-primary hover:bg-primary-dark text-white">
						Continue Shopping
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 ">
			<h1 className="text-2xl font-bold mb-6 text-gray-900">Shopping Cart</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Cart Items Section */}
				<div className="w-full lg:w-2/3">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
						<div className="bg-primary bg-opacity-5 p-4 border-b border-gray-100">
							<div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
								<div className="col-span-4 md:col-span-4">Product</div>
								<div className="col-span-2 text-center hidden md:block">
									Price
								</div>
								<div className="col-span-3 md:col-span-2 text-center">
									Quantity
								</div>
								<div className="col-span-3 md:col-span-2 text-right">Total</div>
								<div className="col-span-3 md:col-span-2 text-right">
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

					<div className="flex justify-between items-center">
						<Link href="/">
							<Button
								variant="outline"
								className="flex items-center gap-2 text-sm">
								<Icon icon="mdi:arrow-left" className="w-4 h-4" />
								Continue Shopping
							</Button>
						</Link>

						{totalPrice < 500 && (
							<div className="text-sm text-secondary">
								Add Rs {500 - totalPrice} more for free shipping
							</div>
						)}
					</div>
				</div>

				{/* Order Summary Section */}
				<div className="w-full lg:w-1/3">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
						<h2 className="text-lg font-bold mb-4 text-gray-900">
							Order Summary
						</h2>

						<div className="space-y-4 mb-6">
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
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<h3 className="text-sm font-medium text-gray-700">
									Delivery Address
								</h3>
								<button
									className="text-xs text-primary hover:underline"
									onClick={() => setIsAddressModalOpen(true)}>
									Change
								</button>
							</div>

							<div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-100">
								{shippingAddress ? (
									<p className="text-gray-600">{shippingAddress}</p>
								) : (
									<p className="text-secondary">
										Please select a shipping address
									</p>
								)}
							</div>
						</div>

						{/* Payment Methods */}
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-700 mb-3">
								Payment Method
							</h3>

							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
								className="space-y-3">
								<div
									className={`flex items-center p-3 border rounded-md cursor-pointer ${
										paymentMethod === "esewa"
											? "border-primary bg-primary/5"
											: "border-gray-200"
									}`}>
									<RadioGroupItem id="esewa" value="esewa" className="mr-3" />
									<Label
										htmlFor="esewa"
										className="flex items-center justify-between w-full cursor-pointer">
										<span>eSewa</span>
										<Image
											src="/esewa.png"
											width={40}
											height={20}
											alt="eSewa"
											className="object-contain"
										/>
									</Label>
								</div>

								<div
									className={`flex items-center p-3 border rounded-md cursor-pointer ${
										paymentMethod === "khalti"
											? "border-primary bg-primary/5"
											: "border-gray-200"
									}`}>
									<RadioGroupItem id="khalti" value="khalti" className="mr-3" />
									<Label
										htmlFor="khalti"
										className="flex items-center justify-between w-full cursor-pointer">
										<span>Khalti</span>
										<Image
											src="/khalti.png"
											width={40}
											height={20}
											alt="Khalti"
											className="object-contain"
										/>
									</Label>
								</div>

								<div
									className={`flex items-center p-3 border rounded-md cursor-pointer ${
										paymentMethod === "cash"
											? "border-primary bg-primary/5"
											: "border-gray-200"
									}`}>
									<RadioGroupItem id="cash" value="cash" className="mr-3" />
									<Label
										htmlFor="cash"
										className="flex items-center justify-between w-full cursor-pointer">
										<span>Cash on Delivery</span>
										<Image
											src="/cod.png"
											width={40}
											height={20}
											alt="Cash on Delivery"
											className="object-contain"
										/>
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Checkout Button */}
						<Button
							className="w-full bg-primary hover:bg-primary-dark text-white py-6"
							onClick={handleCheckout}
							disabled={loading || !shippingAddress}>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
									<span>Processing...</span>
								</div>
							) : (
								<span className="flex items-center justify-center gap-2">
									Checkout
									<Icon icon="mdi:arrow-right" className="w-4 h-4" />
								</span>
							)}
						</Button>

						<p className="mt-4 text-xs text-gray-500 text-center">
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

			{/* Address Selection Modal */}
			{isAddressModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg w-full max-w-md">
						<div className="p-6">
							<h3 className="text-lg font-bold mb-4">
								Select Delivery Address
							</h3>

							<div className="mb-4">
								<Label className="mb-1 block">Shipping Address</Label>
								<Select
									value={shippingAddress}
									onValueChange={setShippingAddress}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select shipping address" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{address.shippingAddress.map((addr, index) => (
												<SelectItem key={index} value={addr}>
													{addr}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div className="mb-6">
								<Label className="mb-1 block">Billing Address</Label>
								<Select
									value={billingAddress}
									onValueChange={setBillingAddress}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select billing address" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{address.billingAddress.map((addr, index) => (
												<SelectItem key={index} value={addr}>
													{addr}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div className="flex justify-end gap-3">
								<Button
									variant="outline"
									onClick={() => setIsAddressModalOpen(false)}>
									Cancel
								</Button>
								<Button
									onClick={() => setIsAddressModalOpen(false)}
									className="bg-primary hover:bg-primary-dark text-white"
									disabled={!shippingAddress || !billingAddress}>
									Confirm
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
