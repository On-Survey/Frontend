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
