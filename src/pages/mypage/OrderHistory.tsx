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

// Mock 데이터 - 추후 삭제 예정
const MOCK_ORDERS: Order[] = [
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

export const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState<OrderHistoryTabId>("all");
	const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getSurveyManagement();
				// API 응답을 Order 타입으로 변환
				const ongoingOrders: Order[] = data.ongoingSurveys.map((survey) =>
					mapSurveyToOrder(survey, "active"),
				);
				const refundedOrders: Order[] = data.refundedSurveys.map((survey) =>
					mapSurveyToOrder(survey, "refund_completed"),
				);
				// 노출중과 환불된 설문을 합침
				const allOrders = [...ongoingOrders, ...refundedOrders];
				if (allOrders.length > 0) {
					setOrders(allOrders);
				} else {
					setOrders(MOCK_ORDERS);
				}
			} catch (error) {
				console.error("설문 목록 조회 실패:", error);
				setOrders(MOCK_ORDERS);
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
