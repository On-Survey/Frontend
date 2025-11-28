export interface Order {
	id: number;
	date: string;
	title: string;
	price: string;
	status:
		| "active"
		| "closed"
		| "refund_requested"
		| "refund_rejected"
		| "refund_completed";
}

export interface OrderDetail {
	id: number;
	title: string;
	status:
		| "active"
		| "closed"
		| "refund_requested"
		| "refund_rejected"
		| "refund_completed";
	orderDate: string;
	paymentInfo: {
		responseCount: number;
		responseCountPrice: number;
		gender: string;
		genderPrice: number;
		ageRange: string;
		ageRangePrice: number;
		location: string;
		locationPrice: number;
	};
	totalPrice: string;
	approvalNumber?: string;
	paymentStatus?: string;
	paymentDateTime?: string;
}

export type OrderHistoryTabId = "all" | "refund";

export interface OrderHistoryTab {
	id: OrderHistoryTabId;
	label: string;
	count: number;
}
