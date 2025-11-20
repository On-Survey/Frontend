import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { createSurveyQuestion } from "../../service/form";
import { isNumberQuestion } from "../../types/survey";

export const NumberPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl && q.type === "number",
			)
		: questions
				.filter((q) => q.type === "number")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isNumberQuestion(targetQuestion)
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

	const handleSubmit = async () => {
		if (!questionId) {
			return;
		}

		const result = await createSurveyQuestion({
			surveyId: state.surveyId ?? 0,
			questionInfo: {
				questionType: "NUMBER",
				title: title ?? "",
				description: description ?? "",
				questionOrder: question?.questionOrder ?? 0,
			},
		});

		if (result.success && typeof result.result !== "string") {
			updateQuestion(questionId, {
				questionId: result.result.info[0].questionId,
			});

			navigate(-1);
		}
	};

	const handleTitleAndDescriptionEdit = () => {
		navigate(`/createForm/number/edit`);
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
						문항 제목 및 설명 수정하기
					</Top.LowerButton>
				}
			/>

			<TextField.Clearable
				variant="line"
				hasError={false}
				label="숫자형"
				labelOption="sustain"
				placeholder="1부터 100까지 입력할 수 있어요"
				inputMode="numeric"
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
