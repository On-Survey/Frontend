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
import { QuestionSelectionBottomSheet } from "../../../components/form/bottomSheet/QuestionSelectionBottomSheet";
import { CreateMultiChoiceBottomSheet } from "../../../components/form/multipleChoice/CreateMultiChoiceBottomSheet";
import { SelectionLimitBottomSheet } from "../../../components/form/multipleChoice/SelectionLimitBottomSheet";
import { useSurvey } from "../../../contexts/SurveyContext";
import { useModal } from "../../../hooks/UseToggle";
import { isMultipleChoiceQuestion } from "../../../types/survey";

export const MultipleChoiceMain = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();

	const questions = state.survey.question;
	const latestMultipleChoice = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isMultipleChoiceQuestion(latestMultipleChoice)
		? latestMultipleChoice
		: undefined;

	const questionId = question?.questionId.toString();
	const maxChoice = question?.maxChoice;
	const options = question?.option ?? [];

	const [isRequired, setIsRequired] = useState(false);
	const { isOpen, handleOpen, handleClose } = useModal(false);

	const {
		isOpen: isCreateMultiChoiceOpen,
		handleOpen: handleCreateMultiChoiceOpen,
		handleClose: handleCreateMultiChoiceClose,
	} = useModal(false);

	const {
		isOpen: isQuestionSelectionOpen,
		handleOpen: handleQuestionSelectionOpen,
		handleClose: handleQuestionSelectionClose,
	} = useModal(false);

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const handleQuestionNavigation = () => {
		navigate("/createForm/multipleChoice/questions");
	};

	const handleDeleteOption = (orderToDelete: number) => {
		if (questionId && question) {
			const updatedOptions = options
				.filter((option) => option.order !== orderToDelete)
				.map((option, index) => ({
					...option,
					order: index + 1,
				}));
			updateQuestion(questionId, {
				option: updatedOptions,
			});
		}
	};

	return (
		<>
			<Border variant="height16" />
			{options.length > 0 && (
				<List>
					{options
						.sort((a, b) => a.order - b.order)
						.map((option) => (
							<ListRow
								key={option.order}
								contents={
									<ListRow.Texts
										type="1RowTypeA"
										top={option.content}
										topProps={{ color: adaptive.grey700 }}
									/>
								}
								right={
									<Asset.Icon name="icon-bin-mono" color={adaptive.grey600} />
								}
								verticalPadding="large"
								onClick={() => handleDeleteOption(option.order)}
							/>
						))}
				</List>
			)}
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

			{questionId && (
				<QuestionSelectionBottomSheet
					questionId={questionId}
					isOpen={isQuestionSelectionOpen}
					handleClose={handleQuestionSelectionClose}
				/>
			)}

			{questionId && (
				<CreateMultiChoiceBottomSheet
					questionId={questionId}
					isOpen={isCreateMultiChoiceOpen}
					handleClose={handleCreateMultiChoiceClose}
					handleQuestionSelectionOpen={handleQuestionSelectionOpen}
				/>
			)}

			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</>
	);
};
