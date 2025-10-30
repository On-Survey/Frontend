import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import QuestionTitleEditBottomSheet from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";

function NumberPage() {
	const { state } = useSurvey();
	const {
		isOpen: isQuestionTitleEditOpen,
		handleOpen: handleQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);

	const [answer, setAnswer] = useState("");
	const [isRequired, setIsRequired] = useState(false);

	const handleAnswerChange = (value: string) => {
		setAnswer(value);
	};

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const questions = state.formData.questions;
	const latestNumber = questions
		.filter((q) => q.type === "number")
		.sort((a, b) => b.order - a.order)[0];
	const title = latestNumber?.title;

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
			/>
			{/* 숫자키패드 사용을 위해서는 type="number" 대신 inputMode="numeric"를 사용해주세요. */}
			<TextField.Clearable
				variant="line"
				hasError={false}
				label="숫자형"
				labelOption="sustain"
				value={answer.toString()}
				placeholder="1부터 100까지 입력할 수 있어요"
				type="numeric"
				onChange={(e) => handleAnswerChange(e.target.value)}
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

export default NumberPage;
