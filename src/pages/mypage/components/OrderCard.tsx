import { adaptive } from "@toss/tds-colors";
import { Asset, Badge, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../../types/order";

interface OrderCardProps {
	order: Order;
}

type BadgeColor = "blue" | "elephant" | "red";

interface BadgeConfig {
	color: BadgeColor;
	label: string;
}

const BADGE_CONFIG: Record<Order["status"], BadgeConfig> = {
	active: { color: "blue", label: "노출중" },
	closed: { color: "elephant", label: "마감" },
	refund_requested: { color: "red", label: "환불 접수" },
	refund_rejected: { color: "red", label: "환불 반려" },
	refund_completed: { color: "red", label: "환불 완료" },
};

export const OrderCard = ({ order }: OrderCardProps) => {
	const navigate = useNavigate();

	const config = BADGE_CONFIG[order.status];

	const handleClick = () => {
		navigate(`/mypage/orderHistory/${order.id}`);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="flex flex-col gap-2 w-full text-left cursor-pointer"
			aria-label="주문 상세 보기"
		>
			<div className="flex items-center justify-between px-2">
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t6"
					fontWeight="semibold"
				>
					{order.date}
				</Text>
				<Text color={adaptive.grey500} typography="t6" fontWeight="semibold">
					〉
				</Text>
			</div>

			<div className="flex flex-col items-start gap-2 bg-gray-50 rounded-xl p-4">
				<Badge variant="weak" color={config.color} size="small">
					{config.label}
				</Badge>
				<div className="flex-1">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="st8"
						fontWeight="semibold"
					>
						{order.title}
					</Text>
					<div className="flex items-center gap-1 mt-1">
						<Text
							display="block"
							color={adaptive.grey700}
							typography="t6"
							fontWeight="medium"
						>
							{order.price}
						</Text>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW20}
							backgroundColor="transparent"
							name="icon-coin-mono"
							color={adaptive.grey600}
							aria-hidden={true}
							ratio="1/1"
						/>
					</div>
				</div>
			</div>
		</button>
	);
};
