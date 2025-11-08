import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type Estimate = {
	date: Date | null;
	location: string;
	age: string;
	gender: string;
	desiredParticipants: string;
};

type PaymentEstimateContextValue = {
	estimate: Estimate;
	handleEstimateChange: (next: Estimate) => void;
	selectedCoinAmount: number | null;
	handleSelectedCoinAmountChange: (amount: number | null) => void;
};

const PaymentContext = createContext<PaymentEstimateContextValue | undefined>(
	undefined,
);

export const PaymentProvider = ({ children }: PropsWithChildren) => {
	const [estimate, setEstimate] = useState<Estimate>({
		date: null,
		location: "",
		age: "",
		gender: "",
		desiredParticipants: "",
	});

	const [selectedCoinAmount, setSelectedCoinAmount] = useState<number | null>(
		null,
	);

	const handleEstimateChange = useCallback((next: Estimate) => {
		setEstimate(next);
	}, []);

	const handleSelectedCoinAmountChange = useCallback(
		(amount: number | null) => {
			setSelectedCoinAmount(amount);
		},
		[],
	);

	const value = useMemo(
		() => ({
			estimate,
			handleEstimateChange,
			selectedCoinAmount,
			handleSelectedCoinAmountChange,
		}),
		[
			estimate,
			handleEstimateChange,
			selectedCoinAmount,
			handleSelectedCoinAmountChange,
		],
	);

	return (
		<PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
	);
};

export const usePaymentEstimate = () => {
	const ctx = useContext(PaymentContext);
	if (!ctx) {
		throw new Error(
			"usePaymentEstimate must be used within a PaymentEstimateProvider",
		);
	}
	return ctx;
};
