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

export type SelectedCoinAmount = {
	sku: string;
	displayName: string;
	displayAmount: string;
};

type PaymentEstimateContextValue = {
	estimate: Estimate;
	handleEstimateChange: (next: Estimate) => void;
	selectedCoinAmount: SelectedCoinAmount | null;
	handleSelectedCoinAmountChange: (amount: SelectedCoinAmount) => void;
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

	const [selectedCoinAmount, setSelectedCoinAmount] =
		useState<SelectedCoinAmount | null>(null);

	const handleEstimateChange = useCallback((next: Estimate) => {
		setEstimate(next);
	}, []);

	const handleSelectedCoinAmountChange = useCallback(
		(amount: SelectedCoinAmount) => {
			setSelectedCoinAmount({
				sku: amount.sku,
				displayName: amount.displayName,
				displayAmount: amount.displayAmount,
			});
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
