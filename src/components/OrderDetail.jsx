import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { StatusBadge, StatusIcon } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function OrderDetail({ order }) {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			{/* Order Header */}
			<div className="border-b border-gray-100 bg-gray-50/80 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-3">
						<h3 className="font-medium text-gray-900">{order._id}</h3>
						<StatusBadge status={order.paymentInfo.status || "processing"} />
						<StatusBadge status={order.status || "processing"} />
					</div>
					<p className="text-sm text-gray-600 mt-1">
						Placed on {formatDate(order.createdAt)}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<p className="font-medium">Rs {order.totalAmount.toFixed(2)}</p>
				</div>
			</div>

			{/* Order Summary */}
			<div className="p-4 sm:p-6">
				<div className="flex items-start gap-4">
					<div className="hidden sm:flex items-center justify-center bg-gray-100 rounded-lg p-3">
						<StatusIcon status={order.status} />
					</div>
					<div className="flex-grow">
						<div className="flex flex-wrap gap-4 mb-4">
							{order.products.slice(0, 3).map((item) => (
								<div key={item.product._id} className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
										<Image
											src={item.product.image}
											alt={item.product.name}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900 line-clamp-1">
											{item.product.name}
										</p>
										<p className="text-xs text-gray-600">
											Qty: {item.quantity}
										</p>
									</div>
								</div>
							))}
							{order.products.length > 3 && (
								<div className="flex items-center">
									<span className="text-sm text-gray-600">
										+{order.products.length - 3} more items
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div
					className={`flex flex-col sm:flex-row gap-3 mt-4 sm:items-center ${
						order.status !== ("pending" || "completed")
							? "justify-end"
							: "justify-between"
					}`}>
					{order.status === "completed" && (
						<Button variant="outline" className="sm:w-auto">
							<Icon icon="mdi:reload" className="h-4 w-4 mr-2" />
							Buy Again
						</Button>
					)}

					{(order.status === "pending" || order.status === "completed") && (
						<Button
							variant="outline"
							className="text-gray-600 sm:w-auto border-gray-200">
							<Icon icon="mdi:map-marker" className="h-4 w-4 mr-2" />
							Track Order
						</Button>
					)}

					<Link href={`/orders/${order._id}`}>
						<Button>
							<span>View Details</span>
							<Icon icon="mdi:arrow-right" className="h-4 w-4 ml-2" />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
