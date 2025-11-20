import { getAccessToken } from "../../utils/tokenManager";
import { api } from "../axios";
import { apiCall } from "../axios/apiClient";
import type { CreatePaymentResponse, PaymentHistoryItem } from ".";

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
	return apiCall<PaymentHistoryItem[]>({
		method: "GET",
		url: "/v1/payments",
	});
};
