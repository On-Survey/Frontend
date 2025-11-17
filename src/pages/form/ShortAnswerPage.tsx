import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QuestionTitleEditBottomSheet } from "../../components/form/bottomSheet/QuestionTitleEditBottomSheet";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { createSurveyQuestion } from "../../service/form";
import { isShortAnswerQuestion } from "../../types/survey";

export const ShortAnswerPage = () => {
	const { state, updateQuestion } = useSurvey();
	const {
		isOpen: isQuestionTitleEditOpen,
		handleOpen: handleQuestionTitleEditOpen,
		handleClose: handleQuestionTitleEditClose,
	} = useModal(false);

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl &&
					q.type === "shortAnswer",
			)
		: questions
				.filter((q) => q.type === "shortAnswer")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isShortAnswerQuestion(targetQuestion)
		? targetQuestion
		: undefined;

	const questionId = question?.questionId.toString();
	const isRequired = question?.isRequired ?? false;
	const title = question?.title;
	const description = question?.description;

	const handleRequiredChange = (checked: boolean) => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: checked,
			});
		}
	};

	const handleConfirm = async () => {
		if (!questionId) {
			return;
		}

		const result = await createSurveyQuestion({
			surveyId: state.surveyId ?? 0,
			questionInfo: {
				questionType: "SHORT",
				title: title ?? "",
				description: description ?? "",
			},
		});

		if (result.success && typeof result.result !== "string") {
			updateQuestion(questionId, {
				questionId: result.result.questionId,
			});

			navigate(-1);
		}
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
					<Top.SubtitleParagraph>{description}</Top.SubtitleParagraph>
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
				value=""
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

			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
