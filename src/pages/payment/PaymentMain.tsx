import { useState } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import {
	EstimatePage,
	PaymentConfirmationPage,
	PaymentLoading,
	PaymentProductPage,
	PaymentSuccessPage,
} from ".";

export type Estimate = {
	date: string;
	location: string;
	age: string;
	gender: string;
	desiredParticipants: string;
};

export const PaymentMain = () => {
	const { paymentStep } = useMultiStep();

	const [estimate, setEstimate] = useState<Estimate>({
		date: "",
		location: "",
		age: "",
		gender: "",
		desiredParticipants: "",
	});

	const handleEstimateChange = (estimate: Estimate) => {
		setEstimate(estimate);
	};

	return (
		<>
			{paymentStep === 0 && (
				<EstimatePage
					estimate={estimate}
					handleEstimateChange={handleEstimateChange}
				/>
			)}
			{paymentStep === 1 && <PaymentProductPage />}
			{paymentStep === 2 && <PaymentConfirmationPage />}
			{paymentStep === 3 && <PaymentLoading />}
			{paymentStep === 4 && <PaymentSuccessPage />}
		</>
	);
};
