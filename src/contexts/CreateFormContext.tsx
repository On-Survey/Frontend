import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type CreateFormContextValue = {
	activeStep: number;
	handleStepChange: (step: number) => void;
	handlePrevious: () => void;
	setActiveStep: (step: number) => void;
};

const CreateFormContext = createContext<CreateFormContextValue | undefined>(
	undefined,
);

export const CreateFormProvider = ({ children }: PropsWithChildren) => {
	const [activeStep, setActiveStep] = useState(0);

	const handleStepChange = useCallback((step: number) => {
		setActiveStep(step);
	}, []);

	const handlePrevious = useCallback(() => {
		setActiveStep((prev) => Math.max(prev - 1, 0));
	}, []);

	const value = useMemo(
		() => ({ activeStep, handleStepChange, handlePrevious, setActiveStep }),
		[activeStep, handleStepChange, handlePrevious],
	);

	return (
		<CreateFormContext.Provider value={value}>
			{children}
		</CreateFormContext.Provider>
	);
};

export const useCreateForm = () => {
	const ctx = useContext(CreateFormContext);
	if (!ctx) {
		throw new Error("useCreateForm must be used within a CreateFormProvider");
	}
	return ctx;
};
