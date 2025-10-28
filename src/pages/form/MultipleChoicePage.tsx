import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	Button,
	FixedBottomCTA,
	List,
	ListRow,
	Switch,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import QuestionTitleEditBottomSheet from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import SelectionLimitBottomSheet from "../../components/form/multipleChoice/SelectionLimitBottomSheet";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import type { MultipleChoiceQuestion } from "../../types/survey";

function MultipleChoicePage() {
	const { state } = useSurvey();

	const questions = state.formData.questions;

	const latestMultipleChoice = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.order - a.order)[0];
	const title = latestMultipleChoice?.title;
	const questionId = latestMultipleChoice?.id;
	const allowSelection = (latestMultipleChoice as MultipleChoiceQuestion)
		?.allowSelection;

	const [isRequired, setIsRequired] = useState(false);
	const { isOpen, handleOpen, handleClose } = useModal(false);
	const {
		isOpen: isQuestionTitleEditOpen,
		handleOpen: handleQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

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
					>
						문항 제목 및 설명 수정하기
					</Top.LowerButton>
				}
			/>
			<Border variant="height16" />
			<List>
				<ListRow
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="꾸준히 작성하고 있다."
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={<Asset.Icon name="icon-bin-mono" color={adaptive.grey600} />}
					verticalPadding="large"
				/>
			</List>
			<div className="h-4" />
			<div className="flex flex-col gap-2 px-6">
				<Button
					size="large"
					variant="weak"
					display="block"
					onClick={handleQuestionTitleEditOpen}
				>
					문항 추가하기
				</Button>
				<Button size="large" color="dark" variant="weak" display="block">
					응답에 따라 문항 이동하기
				</Button>
			</div>
			<div className="h-4" />
			<Border variant="height16" />
			<List>
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
				<ListRow
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="선택 가능 개수"
							topProps={{ color: adaptive.grey700 }}
						/>
					}
					right={
						<ListRow.Texts
							type="Right1RowTypeB"
							top={allowSelection?.toString()}
							topProps={{ color: "#3182f6" }}
							marginTop={0}
						/>
					}
					verticalPadding="large"
					arrowType="right"
					onClick={handleOpen}
				/>
			</List>

			<SelectionLimitBottomSheet
				questionId={questionId}
				isOpen={isOpen}
				handleClose={handleClose}
			/>

			<QuestionTitleEditBottomSheet
				isOpen={isQuestionTitleEditOpen}
				handleClose={handleQuestionTitleEditClose}
			/>

			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
}

export default MultipleChoicePage;
