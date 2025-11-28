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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { createSurveyQuestion } from "../../service/form";
import { isNPSQuestion } from "../../types/survey";

export const NPSPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const [score, setScore] = useState<number | null>(null);

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl && q.type === "nps",
			)
		: questions
				.filter((q) => q.type === "nps")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isNPSQuestion(targetQuestion) ? targetQuestion : undefined;

	const questionId = question?.questionId.toString();
	const isRequired = question?.isRequired;
	const title = question?.title;
	const description = question?.description;

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

	const handleConfirm = async () => {
		if (!questionId) {
			return;
		}

		const result = await createSurveyQuestion({
			surveyId: state.surveyId ?? 0,
			questionInfo: {
				questionType: "NPS",
				title: title ?? "",
				description: description ?? "",
				questionOrder: question?.questionOrder ?? 0,
			},
		});

		if (result.success && typeof result !== "string") {
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
				subtitleTop={<Top.SubtitleBadges badges={[]} />}
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
						문항 제목 및 설명 수정하기
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
								className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"} rounded-full!`}
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
			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
