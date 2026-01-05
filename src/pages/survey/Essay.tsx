import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { useState } from "react";
import { QuestionBadge } from "../../components/QuestionBadge";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

export const SurveyEssay = () => {
	const [maxLength] = useState(500);

	const {
		currentQuestion,
		currentAnswer,
		updateAnswer,
		progress,
		totalQuestions,
		currentQuestionIndex,
		isInvalid,
		submitting,
		handlePrev,
		handleNext,
	} = useSurveyNavigation({
		questionType: "longAnswer",
		validateAnswer: (answer) => answer.trim().length > 0,
	});

	if (!currentQuestion) {
		return null;
	}

	const handleAnswerChange = (value: string) => {
		updateAnswer(currentQuestion.questionId, value.slice(0, maxLength));
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.green500} progress={progress} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{currentQuestion.title}
					</Top.TitleParagraph>
				}
				subtitleTop={<QuestionBadge isRequired={currentQuestion.isRequired} />}
				subtitleBottom={
					currentQuestion.description ? (
						<Top.SubtitleParagraph size={15}>
							{currentQuestion.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className="px-4 flex-1 overflow-y-auto pb-28">
				<textarea
					value={currentAnswer}
					onChange={(e) => handleAnswerChange(e.target.value)}
					placeholder="내용을 입력해주세요"
					className="w-full border border-solid border-gray-200 rounded-xl p-4 text-[15px] leading-6 outline-none focus:border-green-400 min-h-[160px]"
					aria-label="서술형 답변 입력"
				/>
				<div className="mt-2 text-right text-[12px] text-gray-500">
					{currentAnswer.length} / {maxLength}
				</div>
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
						disabled={isInvalid || submitting}
						loading={submitting}
						onClick={handleNext}
						style={
							{ "--button-background-color": "#15c67f" } as React.CSSProperties
						}
					>
						{currentQuestionIndex < totalQuestions - 1 ? "다음" : "제출"}
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyEssay;
