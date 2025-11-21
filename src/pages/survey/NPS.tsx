import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { QuestionBadge } from "../../components/QuestionBadge";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

export const SurveyNPS = () => {
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
		questionType: "nps",
		validateAnswer: (answer) => {
			const score = Number(answer);
			return !Number.isNaN(score) && score > 0;
		},
	});

	if (!currentQuestion) {
		return null;
	}

	const score = currentAnswer ? Number(currentAnswer) : null;

	const handleScoreChange = (value: number) => {
		updateAnswer(currentQuestion.questionId, value.toString());
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={progress} />

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

			<div className="px-4 mt-20 flex-1 overflow-y-auto pb-28">
				<div className="flex gap-2.5 justify-center px-6">
					{Array.from({ length: 10 }, (_, idx) => {
						const v = idx + 1;
						const isActive = score !== null && v <= score;
						return (
							<div key={v} className="flex flex-col items-center gap-2">
								<button
									type="button"
									className={`w-6 h-6 rounded-full! ${isActive ? "bg-blue-400" : "bg-gray-100"}`}
									aria-label={`${v}점`}
									onClick={() => handleScoreChange(v)}
								/>
								<span
									className="text-[14px] font-medium"
									style={{ color: colors.grey600 }}
								>
									{v}
								</span>
							</div>
						);
					})}
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
					>
						{currentQuestionIndex < totalQuestions - 1 ? "다음" : "제출"}
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyNPS;
