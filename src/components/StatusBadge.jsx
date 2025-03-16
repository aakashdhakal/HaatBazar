import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

const statusConfig = {
	pending: {
		color: "bg-yellow-100 text-yellow-800 border border-yellow-300",
		icon: "tabler:clock",
	},
	processing: {
		color: "bg-blue-100 text-blue-800 border border-blue-300",
		icon: "uim:process",
	},
	paid: {
		color: "bg-green-100 text-green-800 border border-green-300",
		icon: "material-symbols:paid-outline-rounded",
	},
	cancelled: {
		color: "bg-red-100 text-red-800 border border-red-300",
		icon: "mdi:package-variant-closed-remove",
	},
	returned: {
		color: "bg-purple-100 text-purple-800 border border-purple-300",
		icon: "bi:arrow-return-right",
	},
	delivered: {
		color: "bg-green-100 text-green-800 border border-green-300",
		icon: "carbon:checkmark-outline",
	},
	shipped: {
		color: "bg-blue-100 text-blue-800 border border-blue-300",
		icon: "material-symbols:delivery-truck-speed-outline-rounded",
	},
};

export const StatusBadge = ({ status }) => {
	const config = statusConfig[status] || statusConfig.pending;
	const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

	return (
		<Badge
			variant="default"
			className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color} inline-flex items-center gap-1.5 transition-none hover:bg-none`}>
			{capitalizedStatus}
		</Badge>
	);
};

export default StatusBadge;

export const StatusIcon = ({ status }) => {
	const config = statusConfig[status] || statusConfig.pending;

	return <Icon icon={config.icon} className="text-2xl text-gray-500" />;
};
