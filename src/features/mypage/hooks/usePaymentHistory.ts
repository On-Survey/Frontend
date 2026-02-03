import { getPaymentStats } from "@features/payment/service/payments";
import type { PaymentStats } from "@features/payment/service/payments/types";
import { useQuery } from "@tanstack/react-query";

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
