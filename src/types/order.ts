export interface Order {
	id: number;
	date: string;
	title: string;
	price: string;
	status: "active" | "closed" | "cancelled";
}

export interface OrderDetail {
	id: number;
	title: string;
	status: "active" | "closed" | "cancelled";
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
}
