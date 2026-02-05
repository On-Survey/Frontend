export interface CreatePaymentResponse {
	code: number;
	message: string;
	result: boolean;
	success: boolean;
}

export interface PaymentHistoryItem {
	paymentId: number;
	paymentDate: string;
	totalAmount: number;
	orderId: string;
}

export interface PaymentHistoryResponse {
	code: number;
	message: string;
	result: PaymentHistoryItem[];
	success: boolean;
}

export interface PaymentStats {
	totalCount: number;
	totalAmount: number;
}

export interface PaymentStatsResponse {
	code: number;
	message: string;
	result: PaymentStats;
	success: boolean;
}
