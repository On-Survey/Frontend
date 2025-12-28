import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { getSurveyManagement } from "../../service/order";
import type {
	Order,
	OrderHistoryTab,
	OrderHistoryTabId,
} from "../../types/order";
import { mapSurveyToOrder } from "../../utils/orderUtils";
import { OrderCard } from "./components/OrderCard";
import { RefundPolicyNotice } from "./components/RefundPolicyNotice";

export const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState<OrderHistoryTabId>("all");
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getSurveyManagement();

				const ongoingOrders: Order[] = data.ongoingSurveys.map((survey) =>
					mapSurveyToOrder(survey, "active"),
				);
				const refundedOrders: Order[] = data.refundedSurveys.map((survey) =>
					mapSurveyToOrder(survey, "refund_completed"),
				);

				const allOrders = [...ongoingOrders, ...refundedOrders];
				setOrders(allOrders);
			} catch (error) {
				console.error("설문 목록 조회 실패:", error);
				setOrders([]);
			}
		};

		fetchOrders();
	}, []);

	const refundStatuses: Order["status"][] = [
		"refund_requested",
		"refund_rejected",
		"refund_completed",
	];

	const tabs: OrderHistoryTab[] = [
		{
			id: "all",
			label: "전체",
			count: orders.length,
		},
		{
			id: "refund",
			label: "환불",
			count: orders.filter((order) => refundStatuses.includes(order.status))
				.length,
		},
	];

	const filteredOrders =
		activeTab === "all"
			? orders
			: activeTab === "refund"
				? orders.filter((order) => refundStatuses.includes(order.status))
				: orders;

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="p-6 pb-4">
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
				<RefundPolicyNotice />
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
