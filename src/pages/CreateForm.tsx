import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { useState } from "react";
import FormTitleStep from "./form/FormTitleStep";

export const CreateForm = () => {
	const [activeStep, setActiveStep] = useState(0);

	const handleStepChange = (step: number) => {
		setActiveStep(step);
	};

	return (
		<div className="min-h-screen flex items-center flex-col">
			<ProgressStepper variant="compact" activeStepIndex={activeStep}>
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
				<ProgressStep />
			</ProgressStepper>
			<div className="flex flex-col gap-4 mt-3">
				{activeStep === 0 && (
					<FormTitleStep onNext={() => handleStepChange(1)} />
				)}
				{activeStep === 1 && <div>Step 2</div>}
				{activeStep === 2 && <div>Step 3</div>}
				{activeStep === 3 && <div>Step 4</div>}
				{activeStep === 4 && <div>Step 5</div>}
			</div>
		</div>
	);
};
