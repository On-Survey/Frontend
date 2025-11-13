import { colors } from "@toss/tds-colors";
import {
	Checkbox,
	CTAButton,
	FixedBottomCTA,
	List,
	ListRow,
	ProgressBar,
	Top,
} from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
	type SurveyParticipationQuestion,
	submitSurveyParticipation,
} from "../../service/surveyParticipation";
import type { SurveyListItem } from "../../types/surveyList";

export const SurveySingleChoice = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const locationState = location.state as
		| {
				surveyId?: string | null;
				survey?: SurveyListItem;
				questions?: SurveyParticipationQuestion[];
		  }
		| undefined;
	const surveyId = useMemo(() => {
		const rawSurveyId = locationState?.surveyId ?? locationState?.survey?.id;
		return rawSurveyId ? Number(rawSurveyId) : null;
	}, [locationState?.survey?.id, locationState?.surveyId]);

	const questions =
		locationState?.questions?.filter(
			(question) => question.type === "multipleChoice",
		) ?? [];
	const totalQuestions = questions.length;

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const currentQuestion = questions[currentQuestionIndex];
	const progress =
		totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

	const handleOptionSelect = (questionId: number, optionContent: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: optionContent,
		}));
	};

	const handlePrev = () => {
		if (currentQuestionIndex === 0) {
			navigate(-1);
			return;
		}
		setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
	};

	const handleNext = async () => {
		if (!currentQuestion) {
			return;
		}

		const answerContent = answers[currentQuestion.questionId];
		if (!answerContent) {
			return;
		}

		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
			return;
		}

		if (!surveyId) {
			console.warn("surveyId가 없어 응답을 제출할 수 없습니다.");
			return;
		}

		try {
			setSubmitting(true);
			const payload = questions.map((question) => ({
				questionId: question.questionId,
				content: answers[question.questionId] ?? "",
			}));
			await submitSurveyParticipation(surveyId, payload);
			navigate("/survey/complete", { replace: true });
		} catch (error) {
			console.error("설문 응답 제출 실패:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const isCurrentAnswered = currentQuestion
		? Boolean(answers[currentQuestion.questionId])
		: false;

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={progress} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{currentQuestion?.title ?? ""}
					</Top.TitleParagraph>
				}
				subtitleTop={
					currentQuestion?.isRequired ? (
						<Top.SubtitleBadges
							badges={[{ text: "필수문항", color: "blue", variant: "fill" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					currentQuestion?.description ? (
						<Top.SubtitleParagraph size={15}>
							{currentQuestion.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className="px-2 flex-1 overflow-y-auto pb-28">
				<List role="radiogroup">
					{currentQuestion?.option?.map((choice) => (
						<ListRow
							key={choice.order}
							role="radio"
							aria-checked={
								answers[currentQuestion.questionId] === choice.content
							}
							onClick={() =>
								handleOptionSelect(currentQuestion.questionId, choice.content)
							}
							contents={
								<ListRow.Texts
									type="1RowTypeA"
									top={choice.content}
									topProps={{ color: colors.grey700 }}
								/>
							}
							right={
								<Checkbox.Line
									checked={
										answers[currentQuestion.questionId] === choice.content
									}
									aria-hidden={true}
								/>
							}
							verticalPadding="large"
						/>
					))}
				</List>
			</div>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton
						color="dark"
						variant="weak"
						display="block"
						onClick={handlePrev}
					>
						이전
					</CTAButton>
				}
				rightButton={
					<CTAButton
						display="block"
						onClick={handleNext}
						disabled={!isCurrentAnswered || submitting}
						loading={submitting}
					>
						{currentQuestionIndex < totalQuestions - 1 ? "다음" : "제출"}
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveySingleChoice;
