import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useState } from "react";
import type { Order } from "../../types/order";
import { OrderCard } from "./components/OrderCard";

export const OrderHistory = () => {
	const [activeTab, setActiveTab] = useState<"all" | "cancelled">("all");

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
			status: "cancelled",
		},
		{
			id: 3,
			date: "2025.08.01",
			title: "영화 시청 경험에 관한 설문",
			price: "23,400원",
			status: "closed",
		},
	];

	const filteredOrders =
		activeTab === "all"
			? orders
			: orders.filter((order) => order.status === "cancelled");

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto p-6">
				<div className="flex gap-6 mb-6">
					<button
						type="button"
						onClick={() => setActiveTab("all")}
						className="flex items-start gap-2"
					>
						<Text
							display="block"
							color={activeTab === "all" ? adaptive.grey900 : adaptive.grey500}
							typography="st8"
							fontWeight="semibold"
						>
							전체
						</Text>
						<Text
							display="block"
							color={activeTab === "all" ? adaptive.grey900 : adaptive.grey500}
							typography="st8"
							fontWeight="semibold"
						>
							{orders.length}
						</Text>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("cancelled")}
						className="flex items-start gap-2"
					>
						<Text
							display="block"
							color={
								activeTab === "cancelled" ? adaptive.grey900 : adaptive.grey500
							}
							typography="st8"
							fontWeight="semibold"
						>
							주문취소
						</Text>
						<Text
							display="block"
							color={
								activeTab === "cancelled" ? adaptive.grey900 : adaptive.grey500
							}
							typography="st8"
							fontWeight="semibold"
						>
							{orders.filter((order) => order.status === "cancelled").length}
						</Text>
					</button>
				</div>

				{/* 주문 목록 */}
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
