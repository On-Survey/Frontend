import { colors } from "@toss/tds-colors";
import {
	CTAButton,
	FixedBottomCTA,
	ProgressBar,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { QuestionBadge } from "../../components/QuestionBadge";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

export const SurveyDate = () => {
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
		questionType: "date",
		validateAnswer: (answer) => answer.trim().length > 0,
	});

	if (!currentQuestion) {
		return null;
	}

	const date = currentAnswer ? new Date(currentAnswer) : undefined;

	const handleDateChange = (selectedDate: Date | undefined) => {
		updateAnswer(currentQuestion.questionId, selectedDate?.toISOString() ?? "");
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

			<WheelDatePicker
				title="날짜를 선택해 주세요"
				value={date}
				onChange={handleDateChange}
				triggerLabel="날짜"
				buttonText="선택하기"
			/>

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

export default SurveyDate;
