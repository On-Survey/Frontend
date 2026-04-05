import { PreviewInconvertibleQuestionBanner } from "@features/google-form-conversion/components/PreviewInconvertibleQuestionBanner";
import {
	PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE,
	PreviewInconvertibleSectionRow,
} from "@features/google-form-conversion/components/PreviewInconvertibleSectionRow";
import { PreviewSectionNavBar } from "@features/google-form-conversion/components/PreviewSectionNavBar";
import { UnsupportedRegisterConfirmBottomSheet } from "@features/google-form-conversion/components/UnsupportedRegisterConfirmBottomSheet";
import { useGoogleFormPreviewInconvertibleBanner } from "@features/google-form-conversion/hooks/useGoogleFormPreviewInconvertibleBanner";
import { useGoogleFormPreviewLocationIntent } from "@features/google-form-conversion/hooks/useGoogleFormPreviewLocationIntent";
import { useGoogleFormPreviewModel } from "@features/google-form-conversion/hooks/useGoogleFormPreviewModel";
import { useGoogleFormPreviewPageActions } from "@features/google-form-conversion/hooks/useGoogleFormPreviewPageActions";
import { useGoogleFormPreviewQuestions } from "@features/google-form-conversion/hooks/useGoogleFormPreviewQuestions";
import { useGoogleFormPreviewSectionNav } from "@features/google-form-conversion/hooks/useGoogleFormPreviewSectionNav";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import { QuestionRenderer } from "@features/survey/pages/components/QuestionRenderer";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	FixedBottomCTA,
	List,
	ListRow,
	Text,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";

export const PreviewPage = () => {
	const { isPreviewFromOptions, focusFirstInconvertibleFromNav, locationKey } =
		useGoogleFormPreviewLocationIntent();

	const {
		isValidEntry,
		validationSuccess,
		previewSectionBlocks,
		hasInconvertible,
	} = useGoogleFormPreviewModel();

	const {
		activePreviewSectionIndex,
		activePreviewBlock,
		getPreviewSectionDisplayNumber,
		goToPreviewSection,
	} = useGoogleFormPreviewSectionNav({
		previewSectionBlocks,
		validationSuccess,
		focusFirstInconvertibleFromNav,
		locationKey,
	});

	const {
		showBanner: showInconvertibleBanner,
		sectionFailedCount,
		highlightLine: bannerHighlightLine,
		canGoPrev: bannerCanGoPrev,
		canGoNext: bannerCanGoNext,
		onBannerPrev,
		onBannerNext,
	} = useGoogleFormPreviewInconvertibleBanner({
		previewSectionBlocks,
		activePreviewSectionIndex,
		goToPreviewSection,
	});

	const {
		answers,
		expandedQuestions,
		updateAnswer,
		handleToggleExpand,
		datePickerContainerRef,
		datePickerValue,
		handleDatePickerOpen,
		handleDateChange,
	} = useGoogleFormPreviewQuestions({ previewSectionBlocks });

	const {
		handlePreviewPrimaryCta,
		previewPrimaryCtaLabel,
		goToInquiry,
		isUnsupportedRegisterSheetOpen,
		handleUnsupportedRegisterSheetClose,
		handleUnsupportedRegisterContinue,
	} = useGoogleFormPreviewPageActions({
		isValidEntry,
		hasInconvertible,
		isPreviewFromOptions,
	});

	const inquiryListRow = (
		<div
			className="mx-4 overflow-hidden rounded-full"
			style={{ backgroundColor: adaptive.grey50 }}
		>
			<List>
				<ListRow
					aria-label="온서베이 운영팀에게 문의하기"
					onClick={goToInquiry}
					left={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-headphone-grey-fill"
							aria-hidden={true}
							ratio="1/1"
						/>
					}
					contents={
						<ListRow.Texts
							type="1RowTypeA"
							top="온서베이 운영팀에게 문의하기"
							topProps={{ color: adaptive.grey800, fontWeight: "semibold" }}
						/>
					}
					verticalPadding="large"
					arrowType="right"
				/>
			</List>
		</div>
	);

	if (!isValidEntry) {
		return null;
	}

	if (previewSectionBlocks.length === 0 && !hasInconvertible) {
		return (
			<>
				{inquiryListRow}
				<Border variant="height16" />
				<Top
					title={
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							설문 미리보기
						</Top.TitleParagraph>
					}
				/>
				<div className="px-6 pt-6">
					<Text color={adaptive.grey700} typography="t6">
						변환된 문항을 불러올 수 없어요, 구글폼 검증을 다시 진행해 주세요
					</Text>
				</div>
				<FixedBottomCTA loading={false} onClick={handlePreviewPrimaryCta}>
					{previewPrimaryCtaLabel}
				</FixedBottomCTA>
			</>
		);
	}

	const visibleSection = activePreviewBlock;
	const visibleSectionNumber =
		visibleSection === null
			? null
			: visibleSection.currSection >= 1
				? visibleSection.currSection
				: activePreviewSectionIndex + 1;
	const visibleSectionTitleText =
		visibleSection && visibleSectionNumber !== null
			? visibleSection.sectionTitle?.trim()
				? `섹션 ${visibleSectionNumber} : ${visibleSection.sectionTitle}`
				: `섹션 ${visibleSectionNumber}`
			: "";

	return (
		<>
			{inquiryListRow}

			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{visibleSection && visibleSectionTitleText ? (
							<TextWithLinks
								text={visibleSectionTitleText}
								variant="inline"
								inheritLinkSize
							/>
						) : (
							"설문 미리보기"
						)}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					visibleSection?.sectionDescription?.trim() ? (
						<Top.SubtitleParagraph size={15} color={adaptive.grey600}>
							<TextWithLinks
								text={visibleSection.sectionDescription}
								variant="inline"
								inheritLinkSize
							/>
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className={hasInconvertible ? "pb-8" : "pb-6"}>
				{visibleSection ? (
					<div
						key={activePreviewSectionIndex}
						data-preview-section-index={activePreviewSectionIndex}
					>
						{visibleSection.rows.map((row, rowIdx) =>
							row.kind === "question" ? (
								<div
									key={row.question.questionId}
									data-question-id={row.question.questionId}
								>
									<QuestionRenderer
										question={row.question}
										answer={answers[row.question.questionId]}
										onAnswerChange={updateAnswer}
										isExpanded={
											expandedQuestions[row.question.questionId] ?? true
										}
										onToggleExpand={() =>
											handleToggleExpand(row.question.questionId)
										}
										onDatePickerOpen={() =>
											handleDatePickerOpen(row.question.questionId)
										}
									/>
								</div>
							) : (
								<div
									key={`inc-${row.detail.type}-${row.globalInconvertibleIndex}-${rowIdx}`}
									data-preview-inconvertible-global={
										row.globalInconvertibleIndex
									}
								>
									<PreviewInconvertibleSectionRow
										detail={row.detail}
										isExpanded={
											expandedQuestions[
												PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE +
													row.globalInconvertibleIndex
											] ?? true
										}
										onToggleExpand={() =>
											handleToggleExpand(
												PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE +
													row.globalInconvertibleIndex,
											)
										}
									/>
								</div>
							),
						)}
						{previewSectionBlocks.length > 1 ? (
							<PreviewSectionNavBar
								sectionCount={previewSectionBlocks.length}
								activeSectionIndex={activePreviewSectionIndex}
								getSectionDisplayNumber={getPreviewSectionDisplayNumber}
								onNavigateToSection={goToPreviewSection}
							/>
						) : null}
					</div>
				) : null}
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

			<FixedBottomCTA
				loading={false}
				onClick={handlePreviewPrimaryCta}
				topAccessory={
					showInconvertibleBanner ? (
						<div className="-mb-4 w-full">
							<PreviewInconvertibleQuestionBanner
								totalFailedCount={sectionFailedCount}
								highlightLine={bannerHighlightLine}
								compactTop={false}
								compactBottom
								onHighlightPrev={onBannerPrev}
								onHighlightNext={onBannerNext}
								canGoHighlightPrev={bannerCanGoPrev}
								canGoHighlightNext={bannerCanGoNext}
							/>
						</div>
					) : undefined
				}
			>
				{previewPrimaryCtaLabel}
			</FixedBottomCTA>

			<UnsupportedRegisterConfirmBottomSheet
				open={isUnsupportedRegisterSheetOpen}
				onClose={handleUnsupportedRegisterSheetClose}
				onContinue={handleUnsupportedRegisterContinue}
			/>
		</>
	);
};
