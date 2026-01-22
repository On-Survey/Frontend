import { useQuery } from "@tanstack/react-query";
import { getPaymentStats } from "../service/payments";
import type { PaymentStats } from "../service/payments/types";

export const usePaymentHistory = () => {
	const {
		data: paymentStats,
		isLoading,
		error,
		refetch,
	} = useQuery<PaymentStats>({
		queryKey: ["paymentStats"],
		queryFn: getPaymentStats,
	});

	return {
		paymentStats: paymentStats ?? { totalCount: 0, totalAmount: 0 },
		isLoading,
		error,
		refetch,
	};
};
