import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import { useSurvey } from "../../../../contexts/SurveyContext";
import { isMultipleChoiceQuestion } from "../../../../types/survey";

interface QuestionSelectionBottomSheetProps {
	questionId: string;
	isOpen: boolean;
	handleClose: () => void;
}
export const QuestionSelectionBottomSheet = ({
	questionId,
	isOpen,
	handleClose,
}: QuestionSelectionBottomSheetProps) => {
	const { state, updateQuestion } = useSurvey();
	const [selection, setSelection] = useState("");

	const question = useMemo(() => {
		const foundQuestion = state.survey.question.find(
			(q) => q.questionId.toString() === questionId,
		);
		return isMultipleChoiceQuestion(foundQuestion) ? foundQuestion : undefined;
	}, [state.survey.question, questionId]);

	const currentOptions = question?.option ?? [];

	const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelection(e.target.value);
	};

	const handleConfirm = () => {
		if (selection.trim() && question) {
			updateQuestion(questionId, {
				option: [
					...currentOptions,
					{
						optionId: null,
						order: currentOptions.length + 1,
						content: selection.trim(),
						nextQuestionId: null,
					},
				],
			});
			setSelection("");
			handleClose();
		}
	};

	const handleCloseWithReset = () => {
		setSelection("");
		handleClose();
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>추가할 옵션을 입력해 주세요</BottomSheet.Header>
			}
			open={isOpen}
			onClose={handleCloseWithReset}
			hasTextField={true}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={!selection.trim()}
					onClick={handleConfirm}
				>
					확인
				</BottomSheet.CTA>
			}
			ctaContentGap={0}
		>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label=""
				labelOption="sustain"
				value={selection}
				onChange={handleSelectionChange}
				placeholder="최대한 간결히 입력해주세요"
				autoFocus={true}
			/>
		</BottomSheet>
	);
};
