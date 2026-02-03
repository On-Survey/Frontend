import { useSurvey } from "@shared/contexts/SurveyContext";
import { useModal } from "@shared/hooks/UseToggle";
import { pushGtmEvent } from "@shared/lib/gtm";
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
import { useLocation, useNavigate } from "react-router-dom";
import { CreateMultiChoiceBottomSheet } from "../../components/bottomSheet/CreateMultiChoiceBottomSheet";
import { QuestionSelectionBottomSheet } from "../../components/bottomSheet/QuestionSelectionBottomSheet";
import { SelectionLimitBottomSheet } from "../../components/bottomSheet/SelectionLimitBottomSheet";
import { useQuestionBackHandler } from "../../hooks/useQuestionBackHandler";
import { useQuestionByType } from "../../hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "../../hooks/useQuestionMutations";

export const MultipleChoiceMain = () => {
	const { state, updateQuestion } = useSurvey();
	const { mutate: createSurveyQuestion } = useCreateSurveyQuestion();

	const location = useLocation();
	const navigate = useNavigate();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const {
		question,
		questionId,
		questionIdFromUrl,
		isRequired,
		title,
		description,
	} = useQuestionByType("multipleChoice");

	const maxChoice = question?.maxChoice;
	const options = question?.option ?? [];

	useQuestionBackHandler({ questionId, questionIdFromUrl });

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

	const handleRequiredChange = () => {
		if (questionId && question) {
			updateQuestion(questionId, {
				isRequired: !question.isRequired,
			});
		}
	};

	const handleQuestionNavigation = () => {
		if (questionId) {
			navigate(`/createForm/multipleChoice/questions?questionId=${questionId}`);
		} else {
			navigate("/createForm/multipleChoice/questions");
		}
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

	const handleConfirm = () => {
		if (questionIdFromUrl) {
			navigate(-1);
			return;
		}

		createSurveyQuestion(
			{
				surveyId: state.surveyId ?? 0,
				questionInfo: {
					questionType: "CHOICE",
					title: title ?? "",
					description: description ?? "",
					questionOrder: question?.questionOrder ?? 0,
				},
			},
			{
				onSuccess: (result) => {
					if (result.success && typeof result !== "string") {
						if (questionId) {
							updateQuestion(questionId, {
								questionId: result.result.questionId,
							});
						}

						const source = locationState?.source ?? "main_cta";
						const status =
							source === "main_cta" || source === "mysurvey_button"
								? "draft"
								: "editing";
						const questionIndex = (question?.questionOrder ?? 0) + 1;

						pushGtmEvent({
							event: "survey_question_add",
							pagePath: "/createForm",
							source,
							step: "question",
							status,
							...(state.surveyId && { survey_id: String(state.surveyId) }),
							question_type: "single_choice",
							question_index: String(questionIndex),
						});

						navigate(-1);
					}
				},
				onError: (error) => {
					console.error("질문 생성 실패:", error);
				},
			},
		);
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
					옵션 추가
				</Button>
				<Button
					size="large"
					color="dark"
					variant="weak"
					display="block"
					onClick={handleQuestionNavigation}
					disabled={options.length === 0 || true}
				>
					응답에 따라 문항 이동
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
						<Switch checked={isRequired} onChange={handleRequiredChange} />
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
							topProps={{ color: "#15c67f" }}
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
					maxOptionsCount={options.length}
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

			<FixedBottomCTA
				loading={false}
				onClick={handleConfirm}
				disabled={options.length === 0}
			>
				확인
			</FixedBottomCTA>
		</>
	);
};
