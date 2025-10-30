import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { useCreateForm } from "../contexts/CreateFormContext";
import FormTitleStep from "./form/FormTitleStep";
import QuestionHome from "./form/QuestionHome";
import ScreeningQuestion from "./screening/ScreeningQuestion";

export const CreateForm = () => {
	const { activeStep } = useCreateForm();

	return (
		<div className="min-h-screen flex items-center flex-col">
			<ProgressStepper variant="compact" activeStepIndex={activeStep}>
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
			</ProgressStepper>
			<div className="flex flex-col w-full px-1 gap-4 mt-3">
				{activeStep === 0 && <FormTitleStep />}
				{activeStep === 1 && <QuestionHome />}
				{activeStep === 2 && <ScreeningQuestion />}
				{activeStep === 3 && <div>Step 4</div>}
				{activeStep === 4 && <div>Step 5</div>}
			</div>
		</div>
	);
};
