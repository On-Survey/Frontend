import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import {
	EstimatePage,
	PaymentConfirmationPage,
	PaymentLoading,
	PaymentProductPage,
	PaymentSuccessPage,
} from ".";

export const PaymentMain = () => {
	const { paymentStep, setPaymentStep } = useMultiStep();
	const location = useLocation();
	const isChargeFlow = location.pathname === "/payment/charge";

	// 충전 플로우일 때 paymentStep이 0이면 자동으로 1로 설정
	useEffect(() => {
		if (isChargeFlow && paymentStep === 0) {
			setPaymentStep(1);
		}
	}, [isChargeFlow, paymentStep, setPaymentStep]);

	return (
		<>
			{!isChargeFlow && paymentStep === 0 && <EstimatePage />}
			{paymentStep === 1 && <PaymentProductPage />}
			{!isChargeFlow && paymentStep === 2 && <PaymentConfirmationPage />}
			{paymentStep === (isChargeFlow ? 2 : 3) && <PaymentLoading />}
			{paymentStep === (isChargeFlow ? 3 : 4) && <PaymentSuccessPage />}
		</>
	);
};
