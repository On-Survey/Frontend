import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type MultiStepContextValue = {
	surveyStep: number;
	setSurveyStep: (step: number) => void;
	goPrevSurvey: () => void;
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
	resetSurvey: () => void;
};

const MultiStepContext = createContext<MultiStepContextValue | undefined>(
	undefined,
);

export const MultiStepProvider = ({ children }: PropsWithChildren) => {
	const [surveyStep, setSurveyStep] = useState(0);
	const [screeningStep, setScreeningStep] = useState(0);
	const [paymentStep, setPaymentStep] = useState(0);

	const goPrevSurvey = useCallback(() => {
		setSurveyStep((prev) => Math.max(prev - 1, 0));
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

	const resetSurvey = useCallback(() => {
		setSurveyStep(0);
	}, []);

	const value = useMemo(
		() => ({
			surveyStep,
			setSurveyStep,
			goPrevSurvey,
			resetSurvey,
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
			surveyStep,
			goPrevSurvey,
			resetSurvey,
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
