import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type MultiStepContextValue = {
	activeStep: number;
	handleStepChange: (step: number) => void;
	handlePrevious: () => void;
	setActiveStep: (step: number) => void;
	screeningStep: number;
	setScreeningStep: (step: number) => void;
	goNextScreening: () => void;
	goPrevScreening: () => void;
	resetScreening: () => void;
	paymentStep: number;
	setPaymentStep: (step: number) => void;
	goNextPayment: () => void;
	goPrevPayment: () => void;
	resetPayment: () => void;
	resetActiveStep: () => void;
};

const MultiStepContext = createContext<MultiStepContextValue | undefined>(
	undefined,
);

export const MultiStepProvider = ({ children }: PropsWithChildren) => {
	const [activeStep, setActiveStep] = useState(0);
	const [screeningStep, setScreeningStep] = useState(0);
	const [paymentStep, setPaymentStep] = useState(0);

	const handleStepChange = useCallback((step: number) => {
		setActiveStep(step);
	}, []);

	const handlePrevious = useCallback(() => {
		setActiveStep((prev) => Math.max(prev - 1, 0));
	}, []);

	const goNextScreening = useCallback(() => {
		setScreeningStep((prev) => Math.min(prev + 1, 4));
	}, []);

	const goPrevScreening = useCallback(() => {
		setScreeningStep((prev) => Math.max(prev - 1, 0));
	}, []);

	const resetScreening = useCallback(() => {
		setScreeningStep(0);
	}, []);

	const goNextPayment = useCallback(() => {
		setPaymentStep((prev) => Math.min(prev + 1, 4));
	}, []);

	const goPrevPayment = useCallback(() => {
		setPaymentStep((prev) => Math.max(prev - 1, 0));
	}, []);

	const resetPayment = useCallback(() => {
		setPaymentStep(0);
	}, []);

	const resetActiveStep = useCallback(() => {
		setActiveStep(0);
	}, []);

	const value = useMemo(
		() => ({
			activeStep,
			handleStepChange,
			handlePrevious,
			setActiveStep,
			resetActiveStep,
			screeningStep,
			setScreeningStep,
			goNextScreening,
			goPrevScreening,
			resetScreening,
			paymentStep,
			setPaymentStep,
			goNextPayment,
			goPrevPayment,
			resetPayment,
		}),
		[
			activeStep,
			handleStepChange,
			handlePrevious,
			resetActiveStep,
			screeningStep,
			goNextScreening,
			goPrevScreening,
			resetScreening,
			paymentStep,
			goNextPayment,
			goPrevPayment,
			resetPayment,
		],
	);

	return (
		<MultiStepContext.Provider value={value}>
			{children}
		</MultiStepContext.Provider>
	);
};

export const useMultiStep = () => {
	const ctx = useContext(MultiStepContext);
	if (!ctx) {
		throw new Error("useMultiStep must be used within a MultiStepProvider");
	}
	return ctx;
};
