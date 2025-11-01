import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import QuestionTitleEditBottomSheet from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";

function ShortAnswerPage() {
	const { state } = useSurvey();
	const {
		isOpen: isQuestionTitleEditOpen,
		handleOpen: handleQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);

	const [answer, setAnswer] = useState("");
	const [isRequired, setIsRequired] = useState(false);

	const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAnswer(e.target.value);
	};
	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const questions = state.formData.questions;

	const latestMultipleChoice = questions
		.filter((q) => q.type === "shortAnswer")
		.sort((a, b) => b.order - a.order)[0];
	const title = latestMultipleChoice?.title;

	return (
		<div>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						보조설명은 이런식으로 들어갈 것 같아요
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handleQuestionTitleEditOpen}
					>
						문항 제목 및 설명 수정하기
					</Top.LowerButton>
				}
				lowerGap={0}
			/>
			<TextArea
				variant="line"
				hasError={false}
				label="단답형 문항"
				labelOption="sustain"
				help="20글자까지 입력할 수 있어요"
				value={answer}
				onChange={handleAnswerChange}
				placeholder="이런 식으로 표기 될거예요"
				maxLength={20}
				autoFocus={true}
			/>
			<Border variant="padding24" />
			<ListRow
				role="switch"
				aria-checked={true}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="필수 문항"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={
					<Switch
						checked={isRequired}
						onChange={() => handleRequiredChange(!isRequired)}
					/>
				}
				verticalPadding="large"
			/>
			<QuestionTitleEditBottomSheet
				isOpen={isQuestionTitleEditOpen}
				handleClose={handleQuestionTitleEditClose}
			/>

			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
}

export default ShortAnswerPage;
