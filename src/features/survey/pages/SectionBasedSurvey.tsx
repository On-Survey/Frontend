import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	CTAButton,
	FixedBottomCTA,
	ProgressBar,
	Text,
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
		progress,
		sectionCount,
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
		isBeforeSubmitStep,
		submitting,
		nextLoading,
		isPending,
		canSkipEmptySectionForward,
	} = useSectionBasedSurveyController();

	const showMilestoneMessage = (sectionCount ?? 0) >= 4 && !isBeforeSubmitStep;
	const showFinalStretchMessage = isBeforeSubmitStep;

	return (
		<>
			<ProgressBar
				size="normal"
				color={adaptive.green500}
				progress={progress}
			/>
			{(showMilestoneMessage || showFinalStretchMessage) && (
				<div className="px-4 mt-4 mb-2 flex items-center gap-2">
					{showFinalStretchMessage ? (
						<>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-place-cheer-exam-1"
								aria-hidden={true}
								ratio="12/11"
							/>
							<Text
								display="block"
								color={adaptive.green800}
								typography="t6"
								fontWeight="semibold"
							>
								거의 다 왔어요. 조금만 힘내세요!
							</Text>
						</>
					) : (
						<>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-check-circle-green-fill"
								aria-hidden={true}
								ratio="1/1"
							/>
							<Text
								display="block"
								color={adaptive.green800}
								typography="t6"
								fontWeight="semibold"
							>
								잘 하고 있어요! 곧 400원 획득!
							</Text>
						</>
					)}
				</div>
			)}
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
							disabled={submitting || isPending}
							loading={submitting}
							onClick={handleSubmitClick}
						>
							제출
						</CTAButton>
					) : (
						<CTAButton
							disabled={
								nextLoading ||
								isPending ||
								(questions.length === 0 && !canSkipEmptySectionForward)
							}
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
