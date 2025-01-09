import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icon } from "@iconify-icon/react";

export default function UserAvatar({ src, size }) {
	return (
		<Avatar>
			<AvatarImage src={src} alt="User Avatar" />
			<AvatarFallback>
				<Icon icon="gridicons:user" width="1.5rem" height="1.5rem" />
			</AvatarFallback>
		</Avatar>
	);
}
