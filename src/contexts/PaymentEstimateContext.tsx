import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type Estimate = {
	date: string;
	location: string;
	age: string;
	gender: string;
	desiredParticipants: string;
};

type PaymentEstimateContextValue = {
	estimate: Estimate;
	handleEstimateChange: (next: Estimate) => void;
};

const PaymentEstimateContext = createContext<
	PaymentEstimateContextValue | undefined
>(undefined);

export const PaymentEstimateProvider = ({ children }: PropsWithChildren) => {
	const [estimate, setEstimate] = useState<Estimate>({
		date: "",
		location: "",
		age: "",
		gender: "",
		desiredParticipants: "",
	});

	const handleEstimateChange = useCallback((next: Estimate) => {
		setEstimate(next);
	}, []);

	const value = useMemo(
		() => ({ estimate, handleEstimateChange }),
		[estimate, handleEstimateChange],
	);

	return (
		<PaymentEstimateContext.Provider value={value}>
			{children}
		</PaymentEstimateContext.Provider>
	);
};

export const usePaymentEstimate = () => {
	const ctx = useContext(PaymentEstimateContext);
	if (!ctx) {
		throw new Error(
			"usePaymentEstimate must be used within a PaymentEstimateProvider",
		);
	}
	return ctx;
};
