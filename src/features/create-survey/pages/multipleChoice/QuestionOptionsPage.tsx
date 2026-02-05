import { useSurvey } from "@shared/contexts/SurveyContext";
import {
	formatQuestionNumber,
	getQuestionTypeLabel,
} from "@shared/lib/questionFactory";
import { isMultipleChoiceQuestion } from "@shared/types/survey";
import { adaptive } from "@toss/tds-colors";
import { List, ListRow, Text, Top } from "@toss/tds-mobile";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const QuestionOptionsPage = () => {
	const { questionId } = useParams<{ questionId: string }>();
	const [searchParams] = useSearchParams();
	const optionOrder = searchParams.get("optionOrder");
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();

	const questions = state.survey.question;
	const targetQuestion = questions.find(
		(q) => q.questionId.toString() === questionId,
	);

	const question = isMultipleChoiceQuestion(targetQuestion)
		? targetQuestion
		: undefined;

	const currentOption = question?.option.find(
		(opt) => opt.order.toString() === optionOrder,
	);

	const sortedQuestions = [...questions].sort(
		(a, b) => a.questionOrder - b.questionOrder,
	);

	const handleQuestionSelect = (selectedQuestionId: number) => {
		if (questionId && optionOrder && question) {
			const updatedOptions = question.option.map((opt) =>
				opt.order.toString() === optionOrder
					? { ...opt, nextQuestionId: selectedQuestionId }
					: opt,
			);

			updateQuestion(questionId, {
				option: updatedOptions,
			});

			navigate(-1);
		}
	};

	if (!question || !currentOption) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						이동할 문항을 선택해주세요
					</Top.TitleParagraph>
				}
			/>
			<List>
				{sortedQuestions.map((q) => {
					const isSelected = currentOption.nextQuestionId === q.questionId;
					return (
						<ListRow
							key={q.questionId}
							contents={
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1 mb-1">
										<Text
											display="block"
											color={adaptive.grey800}
											typography="t5"
											fontWeight="semibold"
											textAlign="center"
											className="w-10 shrink-0"
										>
											{formatQuestionNumber(q.questionOrder + 1)}
										</Text>
										<Text
											display="block"
											color={adaptive.grey700}
											typography="t6"
											fontWeight="semibold"
											textAlign="left"
											className="line-clamp-2 flex-1 min-w-0"
										>
											{q.title}
										</Text>
									</div>
									<div className="flex items-center gap-1 pl-11">
										<Text
											color={adaptive.grey600}
											typography="t7"
											fontWeight="medium"
										>
											{q.isRequired ? "필수" : "선택"}
										</Text>
										<Text
											color={adaptive.grey600}
											typography="t7"
											fontWeight="medium"
										>
											·
										</Text>
										<Text
											color={adaptive.grey600}
											typography="t7"
											fontWeight="medium"
										>
											{getQuestionTypeLabel(q.type)}
										</Text>
									</div>
								</div>
							}
							right={
								isSelected ? (
									<Text color="#3182f6" typography="t7" fontWeight="medium">
										선택됨
									</Text>
								) : null
							}
							verticalPadding="large"
							onClick={() => handleQuestionSelect(q.questionId)}
						/>
					);
				})}
			</List>
		</>
	);
};
