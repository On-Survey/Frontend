import { useCreateForm } from "../../contexts/CreateFormContext";
import {
	EstimatePage,
	PaymentConfirmationPage,
	PaymentLoading,
	PaymentProductPage,
	PaymentSuccessPage,
} from ".";

export const PaymentMain = () => {
	const { paymentStep } = useCreateForm();
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
