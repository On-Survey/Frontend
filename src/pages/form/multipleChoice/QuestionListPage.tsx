import { adaptive } from "@toss/tds-colors";
import { Button, List, ListRow } from "@toss/tds-mobile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";
import { isMultipleChoiceQuestion } from "../../../types/survey";
import { formatQuestionNumber } from "../../../utils/questionFactory";

export const QuestionListPage = () => {
	const { state } = useSurvey();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl &&
					q.type === "multipleChoice",
			)
		: questions
				.filter((q) => q.type === "multipleChoice")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isMultipleChoiceQuestion(targetQuestion)
		? targetQuestion
		: undefined;

	const options = question?.option ?? [];
	const allQuestions = questions.sort(
		(a, b) => a.questionOrder - b.questionOrder,
	);

	const getNextQuestionTitle = (nextQuestionId: number): string => {
		if (nextQuestionId === 0) {
			return "다음 문항으로";
		}
		const nextQuestion = allQuestions.find(
			(q) => q.questionId === nextQuestionId,
		);
		if (nextQuestion) {
			return `${formatQuestionNumber(nextQuestion.questionOrder + 1)}번 문항으로 이동`;
		}
		return "다음 문항으로";
	};

	const handleOptionClick = (questionId: number, optionOrder: number) => {
		navigate(
			`/createForm/multipleChoice/questions/${questionId}?optionOrder=${optionOrder}`,
		);
	};

	return (
		<>
			{question && options.length > 0 ? (
				<List>
					{options
						.sort((a, b) => a.order - b.order)
						.map((option) => (
							<ListRow
								key={option.order}
								contents={
									<ListRow.Texts
										type="1RowTypeA"
										top={option.content}
										topProps={{ color: adaptive.grey700 }}
									/>
								}
								right={
									<ListRow.Texts
										type="Right1RowTypeA"
										top={getNextQuestionTitle(option.nextQuestionId)}
										topProps={{ color: adaptive.grey700 }}
										marginTop={0}
									/>
								}
								verticalPadding="large"
								arrowType="right"
								onClick={() =>
									handleOptionClick(question.questionId, option.order)
								}
							/>
						))}
				</List>
			) : (
				<div className="px-4 py-8 text-center">
					<Button
						size="large"
						color="dark"
						variant="weak"
						display="block"
						onClick={() => navigate(-1)}
					>
						선지를 먼저 추가해주세요
					</Button>
				</div>
			)}
			<div className="h-4" />
			<div className="px-6">
				<Button
					size="large"
					color="dark"
					variant="weak"
					display="block"
					onClick={() => navigate(-1)}
				>
					완료
				</Button>
			</div>
		</>
	);
};
