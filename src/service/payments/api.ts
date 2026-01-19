import { getAccessToken } from "../../utils/tokenManager";
import { api } from "../axios";
import type {
	CreatePaymentResponse,
	PaymentHistoryItem,
	PaymentHistoryResponse,
	PaymentStats,
	PaymentStatsResponse,
} from ".";

export const createPayment = async ({
	orderId,
	price,
}: {
	orderId: string;
	price: number;
}): Promise<CreatePaymentResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreatePaymentResponse,
		{ orderId: string; price: number }
	>(
		`/toss/iap/grant`,
		{
			orderId,
			price,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return data;
};

export const getPaymentHistory = async (): Promise<PaymentHistoryItem[]> => {
	const response = await api.get<PaymentHistoryResponse>("/v1/payments");
	return response.data.result ?? [];
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
	const response = await api.get<PaymentStatsResponse>("/toss/iap/stats");
	return response.data.result ?? { totalCount: 0, totalAmount: 0 };
};
