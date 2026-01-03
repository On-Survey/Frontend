import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { formatQuestionNumber } from "../../utils/questionFactory";
import { useQuestionByType } from "./hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "./hooks/useQuestionMutations";

export const LongAnswerPage = () => {
	const { state, updateQuestion } = useSurvey();
	const { mutate: createSurveyQuestion } = useCreateSurveyQuestion();
	const navigate = useNavigate();

	const {
		question,
		questionId,
		questionIdFromUrl,
		isRequired,
		title,
		description,
	} = useQuestionByType("longAnswer");

	const handleRequiredChange = (checked: boolean) => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: checked,
			});
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
					questionType: "LONG",
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
			navigate(`/createForm/essay/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/essay/edit`);
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
			<TextArea
				variant="box"
				label="장문형 문항"
				labelOption="sustain"
				help="500글자까지 입력할 수 있어요"
				value=""
				placeholder="내용을 입력해주세요"
				height={160}
				maxLength={500}
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
			<FixedBottomCTA loading={false} onClick={handleSubmit}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
