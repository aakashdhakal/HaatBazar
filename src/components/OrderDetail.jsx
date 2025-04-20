import Link from "next/link";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function OrderDetail({ order }) {
	const orderLink = `/orders/${order._id}`;

	return (
		<Link href={orderLink}>
			<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					{/* Order ID and Date */}
					<div>
						<div className="flex items-center gap-2">
							<p className="text-sm text-gray-600">Order ID:</p>
							<p className="font-medium text-gray-900">{order._id}</p>
						</div>
						<p className="text-xs text-gray-500">
							Placed on {formatDate(order.createdAt)}
						</p>
					</div>

					{/* Status Badges */}
					<div className="flex items-center gap-2">
						<StatusBadge status={order.status || "processing"} />
						<StatusBadge status={order.paymentInfo?.status || "pending"} />
					</div>
				</div>

				{/* Order Summary */}
				<div className="mt-3 border-t border-gray-100 pt-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Icon
								icon="mdi:shopping-outline"
								className="h-4 w-4 text-gray-500"
							/>
							<span className="text-sm">
								{order.products.length}{" "}
								{order.products.length === 1 ? "item" : "items"}
							</span>
						</div>
						<p className="font-medium">Rs {order.totalAmount.toFixed(2)}</p>
					</div>
				</div>

				{/* View Details Button */}
				<div className="mt-3 flex justify-end">
					<Button size="sm" variant="outline" className="text-xs sm:text-sm">
						View Details
						<Icon icon="mdi:arrow-right" className="h-3 w-3 ml-1" />
					</Button>
				</div>
			</div>
		</Link>
	);
}
