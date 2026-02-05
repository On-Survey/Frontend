import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { ScreeningOption, ScreeningQuestion, ScreeningSuccess } from ".";

export const ScreeningMain = () => {
	const { screeningStep } = useMultiStep();

	return (
		<>
			{screeningStep === 0 && <ScreeningQuestion />}
			{screeningStep === 1 && <ScreeningOption />}
			{screeningStep === 2 && <ScreeningSuccess />}
		</>
	);
};
