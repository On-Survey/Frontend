import { adaptive } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	ListRow,
	Switch,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { pushGtmEvent } from "../../utils/gtm";
import { formatQuestionNumber } from "../../utils/questionFactory";
import { useQuestionByType } from "./hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "./hooks/useQuestionMutations";

export const DatePage = () => {
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
	} = useQuestionByType("date");

	const date = question?.date;

	const handleDateChange = (newDate: Date) => {
		if (questionId) {
			updateQuestion(questionId, {
				date: newDate,
			});
		}
	};

	const handleIsRequiredChange = () => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: !isRequired,
			});
		}
	};

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(`/createForm/date/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/date/edit`);
		}
	};

	const handleSubmit = () => {
		if (questionIdFromUrl) {
			navigate(-1);
			return;
		}

		createSurveyQuestion(
			{
				surveyId: state.surveyId ?? 0,
				questionInfo: {
					questionType: "DATE",
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
						const status = state.surveyId ? "editing" : "draft";
						const questionIndex = (question?.questionOrder ?? 0) + 1;

						pushGtmEvent({
							event: "survey_question_add",
							pagePath: "/createForm",
							source,
							step: "question",
							status,
							...(state.surveyId && { survey_id: String(state.surveyId) }),
							question_type: "date",
							question_index: questionIndex,
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
					<Top.SubtitleParagraph>
						{description || "보조설명은 이런식으로 들어갈 것 같아요"}
					</Top.SubtitleParagraph>
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
			/>

			<WheelDatePicker
				title={"날짜를 선택해 주세요"}
				value={date}
				onChange={handleDateChange}
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
			<FixedBottomCTA loading={false} onClick={handleSubmit}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
