import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { PaymentMain } from "..";
import { InterestPage } from "../interest";
import { ScreeningMain } from "../screening";
import { FormTitleStep, QuestionHome } from ".";

export const SurveyMain = () => {
	const { surveyStep, paymentStep } = useMultiStep();

	return (
		<div className="min-h-screen flex flex-col">
			<div className="sticky top-0 z-50 w-full bg-white">
				{paymentStep === 0 && (
					<ProgressStepper variant="compact" activeStepIndex={surveyStep}>
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
						<ProgressStep />
					</ProgressStepper>
				)}
			</div>
			<div className="flex flex-col w-full px-1 gap-4 mt-3 flex-1">
				{surveyStep === 0 && <FormTitleStep />}
				{surveyStep === 1 && <QuestionHome />}
				{surveyStep === 2 && <ScreeningMain />}
				{surveyStep === 3 && <InterestPage />}
				{surveyStep === 4 && <PaymentMain />}
			</div>
		</div>
	);
};
