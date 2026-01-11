import { adaptive } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	List,
	ListRow,
	Switch,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { pushGtmEvent } from "../../utils/gtm";
import { formatQuestionNumber } from "../../utils/questionFactory";
import { useQuestionByType } from "./hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "./hooks/useQuestionMutations";

export const NPSPage = () => {
	const { state, updateQuestion } = useSurvey();
	const { mutate: createSurveyQuestion } = useCreateSurveyQuestion();
	const location = useLocation();
	const navigate = useNavigate();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const [score, setScore] = useState<number | null>(null);

	const {
		question,
		questionId,
		questionIdFromUrl,
		isRequired,
		title,
		description,
	} = useQuestionByType("nps");

	const handleRequiredChange = (checked: boolean) => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: checked,
			});
		}
	};

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(`/createForm/nps/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/nps/edit`);
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
					questionType: "NPS",
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
							question_type: "nps",
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
					<Text typography="t5" fontWeight="medium" color={adaptive.grey700}>
						{formatQuestionNumber((question?.questionOrder ?? 0) + 1)}
					</Text>
				}
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
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

			<div className="flex gap-2.5 mt-4 justify-center px-6">
				{Array.from({ length: 10 }, (_, idx) => {
					const v = idx + 1;
					const isActive = score !== null && v <= score;
					return (
						<div key={v} className="flex flex-col items-center gap-2">
							<button
								type="button"
								className={`w-6 h-6 rounded-full ${isActive ? "bg-green-400" : "bg-gray-100"} rounded-full!`}
								aria-label={`$v점`}
								onClick={() => setScore(v)}
							></button>
							<Text
								typography="t5"
								fontWeight="medium"
								color={adaptive.grey600}
							>
								{v}
							</Text>
						</div>
					);
				})}
			</div>

			<div className="mt-8 px-2">
				<List>
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
							<Switch
								checked={isRequired}
								onChange={() => handleRequiredChange(!isRequired)}
							/>
						}
						verticalPadding="large"
					/>
				</List>
			</div>
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
