import { useSurvey } from "@shared/contexts/SurveyContext";
import { formatQuestionNumber } from "@shared/lib/questionFactory";
import { adaptive } from "@toss/tds-colors";
import { Button, List, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useQuestionByType } from "../../hooks/useQuestionByType";

export const QuestionListPage = () => {
	const { state } = useSurvey();
	const { question } = useQuestionByType("multipleChoice");

	const navigate = useNavigate();

	const options = question?.option ?? [];
	const allQuestions = state.survey.question.sort(
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
										top={getNextQuestionTitle(option.nextQuestionId || 0)}
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
