import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { useMultiStep } from "../contexts/MultiStepContext";
import FormTitleStep from "./form/FormTitleStep";
import QuestionHome from "./form/QuestionHome";
import InterestPage from "./interest/InterestPage";
import { PaymentMain } from "./payment";
import ScreeningQuestion from "./screening/ScreeningMain";

export const CreateForm = () => {
	const { activeStep } = useMultiStep();

	return (
		<div className="min-h-screen flex flex-col">
			<div className="sticky top-0 z-50 w-full bg-white">
				<ProgressStepper variant="compact" activeStepIndex={activeStep}>
					<ProgressStep />
					<ProgressStep />
					<ProgressStep />
					<ProgressStep />
					<ProgressStep />
				</ProgressStepper>
			</div>
			<div className="flex flex-col w-full px-1 gap-4 mt-3 flex-1 overflow-y-auto">
				{activeStep === 0 && <FormTitleStep />}
				{activeStep === 1 && <QuestionHome />}
				{activeStep === 2 && <ScreeningQuestion />}
				{activeStep === 3 && <InterestPage />}
				{activeStep === 4 && <PaymentMain />}
			</div>
		</div>
	);
};
