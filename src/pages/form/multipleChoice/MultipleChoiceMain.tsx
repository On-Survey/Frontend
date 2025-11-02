import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	Button,
	FixedBottomCTA,
	List,
	ListRow,
	Switch,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionTitleEditBottomSheet from "../../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import CreateMultiChoiceBottomSheet from "../../../components/form/multipleChoice/CreateMultiChoiceBottomSheet";
import SelectionLimitBottomSheet from "../../../components/form/multipleChoice/SelectionLimitBottomSheet";
import { useSurvey } from "../../../contexts/SurveyContext";
import { useModal } from "../../../hooks/UseToggle";
import type { MultipleChoiceQuestion } from "../../../types/survey";

function MultipleChoiceMain() {
	const { state } = useSurvey();
	const navigate = useNavigate();

	const questions = state.survey.question;
	const latestMultipleChoice = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const questionId = latestMultipleChoice?.questionId.toString();
	const maxChoice = (latestMultipleChoice as MultipleChoiceQuestion)?.maxChoice;

	const [isRequired, setIsRequired] = useState(false);
	const { isOpen, handleOpen, handleClose } = useModal(false);
	const {
		isOpen: isQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);
	const {
		isOpen: isCreateMultiChoiceOpen,
		handleOpen: handleCreateMultiChoiceOpen,
		handleClose: handleCreateMultiChoiceClose,
	} = useModal(false);

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const handleQuestionNavigation = () => {
		navigate("/createForm/multipleChoice/questions");
	};

	return (
		<>
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
					onClick={handleCreateMultiChoiceOpen}
				>
					문항 추가하기
				</Button>
				<Button
					size="large"
					color="dark"
					variant="weak"
					display="block"
					onClick={handleQuestionNavigation}
				>
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
							top={maxChoice?.toString() || "1"}
							topProps={{ color: "#3182f6" }}
							marginTop={0}
						/>
					}
					verticalPadding="large"
					arrowType="right"
					onClick={handleOpen}
				/>
			</List>

			{questionId && (
				<SelectionLimitBottomSheet
					questionId={questionId}
					isOpen={isOpen}
					handleClose={handleClose}
				/>
			)}

			<QuestionTitleEditBottomSheet
				isOpen={isQuestionTitleEditOpen}
				handleClose={handleQuestionTitleEditClose}
			/>

			<CreateMultiChoiceBottomSheet
				isOpen={isCreateMultiChoiceOpen}
				handleClose={handleCreateMultiChoiceClose}
			/>

			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</>
	);
}

export default MultipleChoiceMain;
