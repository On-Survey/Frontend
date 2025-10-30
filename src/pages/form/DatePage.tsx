import { adaptive } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	ListRow,
	Switch,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useState } from "react";
import QuestionTitleEditBottomSheet from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import { useModal } from "../../hooks/UseToggle";

function DatePage() {
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
	return (
		<div>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						타인의 개입 없이 일기(블로그, 개인 회고 등)를 쓴 경험이 있나요?
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
}

export default DatePage;
