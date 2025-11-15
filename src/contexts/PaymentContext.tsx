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
	totalPrice: number;
	handleTotalPriceChange: (price: number) => void;
};

const PaymentContext = createContext<PaymentEstimateContextValue | undefined>(
	undefined,
);

export const PaymentProvider = ({ children }: PropsWithChildren) => {
	const [estimate, setEstimate] = useState<Estimate>({
		date: new Date(),
		location: "전체",
		age: "전체",
		gender: "전체",
		desiredParticipants: "50명",
	});

	const [selectedCoinAmount, setSelectedCoinAmount] =
		useState<SelectedCoinAmount | null>(null);

	const [totalPrice, setTotalPrice] = useState<number>(0);

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

	const handleTotalPriceChange = useCallback((price: number) => {
		setTotalPrice(price);
	}, []);

	const value = useMemo(
		() => ({
			estimate,
			handleEstimateChange,
			selectedCoinAmount,
			handleSelectedCoinAmountChange,
			totalPrice,
			handleTotalPriceChange,
		}),
		[
			estimate,
			handleEstimateChange,
			selectedCoinAmount,
			handleSelectedCoinAmountChange,
			totalPrice,
			handleTotalPriceChange,
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
