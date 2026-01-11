import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { pushGtmEvent } from "../../utils/gtm";
import { formatQuestionNumber } from "../../utils/questionFactory";
import { useQuestionByType } from "./hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "./hooks/useQuestionMutations";

export const ShortAnswerPage = () => {
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
	} = useQuestionByType("shortAnswer");

	const handleRequiredChange = (checked: boolean) => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: checked,
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
					questionType: "SHORT",
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
							question_type: "short_text",
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

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(`/createForm/shortAnswer/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/shortAnswer/edit`);
		}
	};

	return (
		<div>
			<Top
				subtitleTop={
					<p className="text-sm font-medium text-gray-500">
						{formatQuestionNumber((question?.questionOrder ?? 0) + 1)}
					</p>
				}
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
						onClick={handleTitleAndDescriptionEdit}
					>
						수정하기
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
			<FixedBottomCTA
				loading={false}
				onClick={handleConfirm}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				확인
			</FixedBottomCTA>
		</div>
	);
};
