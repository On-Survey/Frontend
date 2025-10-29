import { adaptive } from "@toss/tds-colors";
import { Button, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";

function QuestionListPage() {
	const { state } = useSurvey();
	const navigate = useNavigate();

	const questions = state.formData.questions;
	const multipleChoiceQuestions = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.order - a.order);

	const handleQuestionClick = (questionId: string) => {
		navigate(`/createForm/multipleChoice/questions/${questionId}`);
	};

	return (
		<>
			{multipleChoiceQuestions.map((question) => (
				<ListRow
					key={question.id}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="꾸준히 작성하고 있다."
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={
						<ListRow.Texts
							type="Right1RowTypeA"
							top="3번 문항으로 이동"
							topProps={{ color: adaptive.grey700 }}
							marginTop={0}
						/>
					}
					verticalPadding="large"
					arrowType="right"
					onClick={() => handleQuestionClick(question.id)}
				/>
			))}
			<div className="h-4" />
			<div className="px-6">
				<Button
					size="large"
					color="dark"
					variant="weak"
					display="block"
					className=""
				>
					완료
				</Button>
			</div>
		</>
	);
}

export default QuestionListPage;
