"use client";
import { useEffect, useState } from "react";
import CartProduct from "../_components/CartProduct";
import { getCart } from "../actions/cart";
import { Separator } from "../_components/ui/separator";
import { Button } from "../_components/ui/button";
import { useCart } from "../context/CartContext";
import { RadioGroup, RadioGroupItem } from "../_components/ui/radio-group";
import { Label } from "../_components/ui/label";
import Image from "next/image";
import { Checkbox } from "../_components/ui/checkbox";
import { HmacSHA256 } from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import { initiateKhaltiPayment } from "../actions/payment";
import { fetchUserAddress } from "../actions/users";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../_components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../_components/ui/select";
import { useSearchParams } from "next/navigation";
import { createOrder } from "../actions/order";

const hash = (message) => {
	const secretKey = process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;
	return Base64.stringify(HmacSHA256(message, secretKey));
};

const decodeData = (data) => {
	const decoded = JSON.parse(atob(data));
	return decoded;
};

export default function Cart() {
	const parameters = useSearchParams();
	const data = parameters.get("data");
	const khaltiStatus = parameters.get("status");
	if (data) {
		const payment = decodeData(data);
		if (payment.status === "COMPLETE") {
			// redirect("/");
		}
	}
	if (khaltiStatus) {
		if (khaltiStatus === "Completed") {
			console.log("Payment successful");
			// redirect("/");
		}
	}

	const { cartItems, setCartItems } = useCart({});
	let [totalPrice, setTotalPrice] = useState(0);
	let [paymentMethod, setPaymentMethod] = useState("esewa");
	let shippingFee = 50;
	let [loading, setLoading] = useState(false);
	let [address, setAddress] = useState({
		shippingAddress: [],
		billingAddress: [],
	});
	let [shippingAddress, setShippingAddress] = useState("");
	let [billingAddress, setBillingAddress] = useState("");

	useEffect(() => {
		const fetchCartItems = async () => {
			setCartItems(await getCart());
		};

		fetchCartItems();
	}, [setCartItems]);

	useEffect(() => {
		let total = 0;
		Object.values(cartItems).forEach((item) => {
			total += item.price * item.quantity;
		});
		setTotalPrice(total);

		const fetchAddress = async () => {
			const address = await fetchUserAddress();
			setAddress(address);
			setShippingAddress(address.shippingAddress[0]);
			setBillingAddress(address.billingAddress[0]);
		};
		fetchAddress();
	}, [cartItems]);

	const handleRemove = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item._id !== productId),
		);
	};

	const handleCheckout = async () => {
		setLoading(true);

		//random number for transaction id
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
		} catch (error) {
			console.error("Error placing order", error);
		}

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
					success_url: "http://localhost:3000/cart",
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
				break;
			default:
				break;
		}
		setLoading(false);
	};

	return (
		<div className="flex items-start  gap-16 w-full  justify-center py-8 container mx-auto">
			<div className="w-full flex justify-start flex-col gap-4">
				<div className="flex gap-4 items-center p-4 bg-gray-100 text-gray-500 rounded-lg text-center w-full">
					{/* checkbox */}
					<Checkbox />
					{/* table headers */}
					<p className="w-[25%] text-left">Product</p>
					<p className="w-[10%]">Price</p>
					<p className="w-[30%]">Quantity</p>
					<p className="w-[20%]">Total</p>
					<p className="w-[10%]">Action</p>
				</div>
				<div className="w-full flex flex-col gap-4 ">
					{Object.values(cartItems).map((product, index) => (
						<CartProduct
							product={product}
							key={product._id || index}
							onRemove={handleRemove}
						/>
					))}
				</div>
			</div>
			{/* order summary */}
			<div className="w-[30%] p-4 bg-gray-100 text-gray-500 rounded-2xl text-center flex flex-col gap-6">
				<h2 className="text-lg font-bold">Order Summary</h2>
				<Separator />
				<div className="flex justify-between items-center gap-4">
					<p>Subtotal</p>
					<p>Rs {totalPrice}</p>
				</div>
				<div className="flex justify-between items-center gap-4">
					<p>Shipping</p>
					<p>Rs {shippingFee}</p>
				</div>
				<Separator />
				<div className="flex justify-between items-center gap-4">
					<p>Total</p>
					<p>Rs {totalPrice + shippingFee}</p>
				</div>
				<Separator />
				<RadioGroup defaultValue="esewa" className="flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<RadioGroupItem
							value="esewa"
							id="esewa"
							onClick={(e) => setPaymentMethod(e.target.value)}
						/>
						<Label
							className="flex items-center gap-4 w-full justify-between"
							htmlFor="esewa">
							Pay with Esewa
							<Image
								src="/esewa.png"
								width={60}
								height={10}
								alt="esewa logo"
								className="object-cover"
							/>
						</Label>
					</div>
					<div className="flex items-center gap-4">
						<RadioGroupItem
							value="khalti"
							id="khalti"
							onClick={(e) => setPaymentMethod(e.target.value)}
						/>
						<Label
							className="flex items-center gap-4 w-full justify-between"
							htmlFor="khalti">
							Pay with Khalti
							<Image
								src="/khalti.png"
								width={60}
								height={10}
								alt="esewa logo"
								className="object-cover"
							/>
						</Label>
					</div>
					<div className="flex items-center gap-4">
						<RadioGroupItem
							value="cash"
							id="cash"
							onClick={(e) => setPaymentMethod(e.target.value)}
						/>
						<Label
							className="flex items-center gap-4 w-full justify-between"
							htmlFor="cash">
							Cash on Delivery
							<Image
								src="/cod.png"
								width={60}
								height={10}
								alt="esewa logo"
								className="object-cover"
							/>
						</Label>
					</div>
				</RadioGroup>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="default">
							Checkout with{" "}
							{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
						</Button>
					</DialogTrigger>
					<DialogContent className="w-max gap-8">
						<DialogHeader className="gap-3">
							<DialogTitle>Confirm Checkout</DialogTitle>
							<DialogDescription>
								Are you sure you want to checkout with{" "}
								{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
								?
							</DialogDescription>
						</DialogHeader>
						{/* select shipping and billing address */}
						<div>
							<Select
								defaultValue={address.shippingAddress[0]}
								onValueChange={(value) => setShippingAddress(value)}>
								<Label>Shipping Address</Label>
								<SelectTrigger className="w-[400px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{address.shippingAddress.map((address, index) => (
											<SelectItem key={index} value={address}>
												{address}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Select
								defaultValue={address.billingAddress[0]}
								onValueChange={(value) => setBillingAddress(value)}>
								<Label>Billing Address</Label>
								<SelectTrigger className="text-ellipsis w-[400px]">
									<SelectValue placeholder={address.billingAddress[0]} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{address.billingAddress.map((address, index) => (
											<SelectItem key={index} value={address}>
												{address}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<DialogFooter>
							<Button
								varient="default"
								onClick={handleCheckout}
								isLoading={loading}
								loadingtext="Checking out">
								Pay with{" "}
								{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
