import { adaptive } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	ListRow,
	Switch,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useState } from "react";
import { QuestionTitleEditBottomSheet } from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";

export const DatePage = () => {
	const { state } = useSurvey();
	const {
		isOpen: isQuestionTitleEditOpen,
		handleOpen: handleQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);

	const [date, setDate] = useState(new Date());
	const [isRequired, setIsRequired] = useState(true);

	const handleIsRequiredChange = () => {
		setIsRequired(!isRequired);
	};

	const questions = state.survey.question;

	const latestDate = questions
		.filter((q) => q.type === "date")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestDate?.title;

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

			<WheelDatePicker
				title={"날짜를 선택해 주세요"}
				value={date}
				onChange={(date) => setDate(date)}
				triggerLabel={"날짜"}
				buttonText={"선택하기"}
			/>
			<ListRow
				role="switch"
				aria-checked={isRequired}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="필수 문항"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={
					<Switch checked={isRequired} onChange={handleIsRequiredChange} />
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
};
