import { adaptive } from "@toss/tds-colors";
import { BottomSheet, ListRow } from "@toss/tds-mobile";
import { useMemo } from "react";
import { useSurvey } from "../../../contexts/SurveyContext";
import { isMultipleChoiceQuestion } from "../../../types/survey";

interface CreateMultiChoiceBottomSheetProps {
	questionId: string;
	isOpen: boolean;
	handleClose: () => void;
	handleQuestionSelectionOpen: () => void;
}

export const CreateMultiChoiceBottomSheet = ({
	questionId,
	isOpen,
	handleClose,
	handleQuestionSelectionOpen,
}: CreateMultiChoiceBottomSheetProps) => {
	const { state, updateQuestion } = useSurvey();

	const handleSelectionOpen = () => {
		handleQuestionSelectionOpen();
		handleClose();
	};

	const question = useMemo(() => {
		const foundQuestion = state.survey.question.find(
			(q) => q.questionId.toString() === questionId,
		);
		return isMultipleChoiceQuestion(foundQuestion) ? foundQuestion : undefined;
	}, [state.survey.question, questionId]);

	const currentOptions = question?.option ?? [];

	const hasOtherOption = useMemo(() => {
		return currentOptions.some(
			(option) => option.content === "기타 (직접 입력)",
		);
	}, [currentOptions]);

	const handleAddOtherOption = () => {
		if (question && !hasOtherOption) {
			updateQuestion(questionId, {
				option: [
					...currentOptions,
					{
						order: currentOptions.length + 1,
						content: "기타 (직접 입력)",
						nextQuestionId: 0,
					},
				],
			});
			handleClose();
		}
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>어떤 항목을 추가할까요?</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<ListRow
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="새 보기"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				verticalPadding="large"
				arrowType="right"
				onClick={handleSelectionOpen}
			/>
			<ListRow
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="기타 (직접 입력)"
						topProps={{
							color: hasOtherOption ? adaptive.grey400 : adaptive.grey700,
						}}
					/>
				}
				verticalPadding="large"
				arrowType="right"
				onClick={handleAddOtherOption}
				disabled={hasOtherOption}
			/>
		</BottomSheet>
	);
};
