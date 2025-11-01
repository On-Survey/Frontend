import { adaptive } from "@toss/tds-colors";
import { Border, Top } from "@toss/tds-mobile";
import FormController from "../../components/form/FormController";
import { useCreateForm } from "../../contexts/CreateFormContext";
import { useSurvey } from "../../contexts/SurveyContext";

function QuestionHome() {
	const { state } = useSurvey();
	const { handleStepChange } = useCreateForm();

	const handlePrevious = () => {
		handleStepChange(0);
	};
	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{state.formData.title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{state.formData.description}
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
}

export default QuestionHome;
