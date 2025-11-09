import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { useMultiStep } from "../contexts/MultiStepContext";
import { PaymentMain } from ".";
import { FormTitleStep, QuestionHome } from "./form";
import { InterestPage } from "./interest";
import { ScreeningMain } from "./screening";

export const CreateForm = () => {
	const { activeStep, paymentStep } = useMultiStep();

	return (
		<div className="min-h-screen flex flex-col">
			<div className="sticky top-0 z-50 w-full bg-white">
				{paymentStep === 0 && (
					<ProgressStepper variant="compact" activeStepIndex={activeStep}>
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
					</ProgressStepper>
				)}
			</div>
			<div className="flex flex-col w-full px-1 gap-4 mt-3 flex-1 overflow-y-auto">
				{activeStep === 0 && <FormTitleStep />}
				{activeStep === 1 && <QuestionHome />}
				{activeStep === 2 && <ScreeningMain />}
				{activeStep === 3 && <InterestPage />}
				{activeStep === 4 && <PaymentMain />}
			</div>
		</div>
	);
};
