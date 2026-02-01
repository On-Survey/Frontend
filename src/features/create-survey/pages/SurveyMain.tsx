import { InterestPage } from "@features/onboarding/pages/interest/InterestPage";
import { PaymentMain } from "@features/payment/pages/PaymentMain";
import { ScreeningMain } from "@features/screening/pages/ScreeningMain";
import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { ProgressStep, ProgressStepper } from "@toss/tds-mobile";
import { FormTitleStep } from "./FormTitleStep";
import { QuestionHome } from "./QuestionHome";

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
