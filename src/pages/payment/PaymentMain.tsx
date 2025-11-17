import { useMultiStep } from "../../contexts/MultiStepContext";
import {
	EstimatePage,
	PaymentConfirmationPage,
	PaymentLoading,
	PaymentProductPage,
	PaymentSuccessPage,
} from ".";

export const PaymentMain = () => {
	const { paymentStep } = useMultiStep();

	return (
		<>
			{paymentStep === 0 && <EstimatePage />}
			{paymentStep === 1 && <PaymentProductPage />}
			{paymentStep === 2 && <PaymentConfirmationPage />}
			{paymentStep === 3 && <PaymentLoading />}
			{paymentStep === 4 && <PaymentSuccessPage />}
		</>
	);
};
