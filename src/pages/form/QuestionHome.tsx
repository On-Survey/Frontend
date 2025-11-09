import { adaptive } from "@toss/tds-colors";
import { Border, Top } from "@toss/tds-mobile";
import { FormController } from "../../components/form/FormController";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";

export const QuestionHome = () => {
	const { state } = useSurvey();
	const { handleStepChange } = useMultiStep();

	const handlePrevious = () => {
		handleStepChange(0);
	};
	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{state.survey.title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{state.survey.description}
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handlePrevious}
					>
						시작 정보 수정하기
					</Top.LowerButton>
				}
			/>
			<Border variant="height16" />
			<div className="h-3" />

			<FormController />
		</>
	);
};
