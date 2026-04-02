import { adaptive } from "@toss/tds-colors";
import {
	Border,
	CTAButton,
	FixedBottomCTA,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { TextWithLinks } from "../components/TextWithLinks";
import { useSectionBasedSurveyController } from "../hooks/useSectionBasedSurveyController";
import { QuestionRenderer } from "./components/QuestionRenderer";

export const SectionBasedSurvey = () => {
	const {
		headerTitleText,
		headerSubtitleText,
		questions,
		answers,
		updateAnswer,
		questionErrors,
		expandedQuestions,
		handleToggleExpand,
		handleDatePickerOpen,
		handleDateChange,
		datePickerContainerRef,
		datePickerValue,
		handlePrev,
		handleNext,
		handleSubmitClick,
		isLastSection,
		submitting,
		nextLoading,
		isPending,
	} = useSectionBasedSurveyController();

	return (
		<>
			<Top
				title={
					headerTitleText ? (
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							<TextWithLinks
								text={headerTitleText}
								variant="inline"
								inheritLinkSize
							/>
						</Top.TitleParagraph>
					) : undefined
				}
				subtitleBottom={
					headerSubtitleText ? (
						<Top.SubtitleParagraph size={15}>
							<TextWithLinks text={headerSubtitleText} variant="inline" />
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>
			<Border variant="height16" />

			<div className="pb-14">
				{questions.map((q) => (
					<div key={q.questionId} data-question-id={q.questionId}>
						<QuestionRenderer
							question={q}
							answer={answers[q.questionId]}
							onAnswerChange={updateAnswer}
							error={!!questionErrors[q.questionId]}
							errorMessage={questionErrors[q.questionId]}
							isExpanded={expandedQuestions[q.questionId]}
							onToggleExpand={() => handleToggleExpand(q.questionId)}
							onDatePickerOpen={() => handleDatePickerOpen(q.questionId)}
						/>
					</div>
				))}
			</div>

			<div
				ref={datePickerContainerRef}
				style={{
					position: "absolute",
					left: "-9999px",
					opacity: 0,
					pointerEvents: "none",
				}}
			>
				<WheelDatePicker
					title="날짜를 선택해 주세요"
					value={datePickerValue ?? new Date()}
					onChange={handleDateChange}
					triggerLabel="날짜"
					buttonText="선택하기"
				/>
			</div>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton variant="weak" onClick={handlePrev}>
						이전
					</CTAButton>
				}
				rightButton={
					isLastSection ? (
						<CTAButton
							disabled={submitting || isPending || questions.length === 0}
							loading={submitting}
							onClick={handleSubmitClick}
						>
							제출
						</CTAButton>
					) : (
						<CTAButton
							disabled={nextLoading || isPending || questions.length === 0}
							loading={nextLoading}
							onClick={handleNext}
						>
							다음
						</CTAButton>
					)
				}
			/>
		</>
	);
};
