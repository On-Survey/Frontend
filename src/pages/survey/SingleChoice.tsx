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
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

export const SurveySingleChoice = () => {
	const {
		currentQuestion,
		currentAnswer,
		answers,
		updateAnswer,
		progress,
		totalQuestions,
		currentQuestionIndex,
		submitting,
		handlePrev,
		handleNext,
	} = useSurveyNavigation({
		questionType: "multipleChoice",
		validateAnswer: (answer) => answer.trim().length > 0,
	});

	if (!currentQuestion) {
		return null;
	}

	const handleOptionSelect = (optionContent: string) => {
		updateAnswer(currentQuestion.questionId, optionContent);
	};

	const isCurrentAnswered = Boolean(currentAnswer);

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
					{currentQuestion?.options?.map((choice) => (
						<ListRow
							key={choice.optionId}
							role="radio"
							aria-checked={
								answers[currentQuestion.questionId] === choice.content
							}
							onClick={() => handleOptionSelect(choice.content)}
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
