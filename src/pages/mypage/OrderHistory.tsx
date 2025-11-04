import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useState } from "react";
import type {
	Order,
	OrderHistoryTab,
	OrderHistoryTabId,
} from "../../types/order";
import { OrderCard } from "./components/OrderCard";

export const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState<OrderHistoryTabId>("all");

	const orders: Order[] = [
		{
			id: 1,
			date: "2025.08.01",
			title: "영화 시청 경험에 관한 설문",
			price: "23,400원",
			status: "active",
		},
		{
			id: 2,
			date: "2025.10.01",
			title: "영화 시청 경험에 관한 설문",
			price: "23,400원",
			status: "refund_requested",
		},
		{
			id: 3,
			date: "2025.08.01",
			title: "영화 시청 경험에 관한 설문",
			price: "23,400원",
			status: "closed",
		},
		{
			id: 4,
			date: "2025.09.01",
			title: "음식 취향에 관한 설문",
			price: "15,000원",
			status: "refund_rejected",
		},
		{
			id: 5,
			date: "2025.07.01",
			title: "여행 계획에 관한 설문",
			price: "30,000원",
			status: "refund_completed",
		},
	];

	const refundStatuses: Order["status"][] = [
		"refund_requested",
		"refund_rejected",
		"refund_completed",
	];

	const filteredOrders =
		activeTab === "all"
			? orders
			: orders.filter((order) => refundStatuses.includes(order.status));

	const tabs: OrderHistoryTab[] = [
		{
			id: "all",
			label: "전체",
			count: orders.length,
		},
		{
			id: "cancelled",
			label: "주문취소",
			count: orders.filter((order) => refundStatuses.includes(order.status))
				.length,
		},
	];

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-shrink-0 p-6 pb-4">
				<div className="flex gap-6">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className="flex items-start gap-2"
							>
								<Text
									display="block"
									color={isActive ? adaptive.grey900 : adaptive.grey500}
									typography="st8"
									fontWeight="semibold"
								>
									{tab.label}
								</Text>
								<Text
									display="block"
									color={isActive ? adaptive.grey900 : adaptive.grey500}
									typography="st8"
									fontWeight="semibold"
								>
									{tab.count}
								</Text>
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-6 pb-6">
				<div className="space-y-2">
					{filteredOrders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			</div>
		</div>
	);
};

export default OrderHistory;
