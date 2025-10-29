import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import { useParams } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";
import type { MultipleChoiceQuestion } from "../../../types/survey";

function QuestionOptionsPage() {
	const { questionId } = useParams<{ questionId: string }>();
	const { state } = useSurvey();

	const questions = state.formData.questions;
	const question = questions.find(
		(q) => q.id === questionId,
	) as MultipleChoiceQuestion;

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						이동할 문항을 선택해주세요
					</Top.TitleParagraph>
				}
			/>
			{question.options.map((option) => (
				<div key={option.id}>{option.text}</div>
			))}
		</>
	);
}

export default QuestionOptionsPage;
