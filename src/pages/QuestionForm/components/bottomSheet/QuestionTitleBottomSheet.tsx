import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTION_TYPE_ROUTES } from "../../../../constants/routes";
import { useSurvey } from "../../../../contexts/SurveyContext";
import type { QuestionType } from "../../../../types/survey";
import { createQuestion } from "../../../../utils/questionFactory";

interface QuestionTitleBottomSheetProps {
	onClose: () => void;
	isOpen: boolean;
	questionType: QuestionType;
}

export const QuestionTitleBottomSheet = ({
	onClose,
	isOpen,
	questionType,
}: QuestionTitleBottomSheetProps) => {
	const { addQuestion } = useSurvey();

	const [title, setTitle] = useState("");

	const navigate = useNavigate();

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleConfirm = () => {
		if (title.trim()) {
			const newQuestion = createQuestion(questionType, title.trim());
			addQuestion(newQuestion);
			setTitle("");
			onClose();
			navigate(QUESTION_TYPE_ROUTES[questionType]);
		}
	};

	const handleClose = () => {
		setTitle("");
		onClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>문항 제목을 입력해주세요</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			hasTextField={true}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={!title.trim()}
					onClick={handleConfirm}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					확인
				</BottomSheet.CTA>
			}
			ctaContentGap={0}
		>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label="문항 제목"
				labelOption="sustain"
				value={title}
				onChange={handleTitleChange}
				placeholder="최대한 간결히 입력해주세요"
				autoFocus={true}
			/>
		</BottomSheet>
	);
};
