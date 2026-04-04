import { PreviewInconvertibleQuestionBanner } from "@features/google-form-conversion/components/PreviewInconvertibleQuestionBanner";
import { PreviewSectionNavBar } from "@features/google-form-conversion/components/PreviewSectionNavBar";
import { UnsupportedRegisterConfirmBottomSheet } from "@features/google-form-conversion/components/UnsupportedRegisterConfirmBottomSheet";
import {
	useRequestEntryContext,
	useRequestFormContext,
} from "@features/google-form-conversion/context/RequestEntryContext";
import { getQuestionNumberLabelForValidationDetail } from "@features/google-form-conversion/lib/getQuestionNumberLabelForValidationDetail";
import { hasInconvertibleFromValidationSuccess } from "@features/google-form-conversion/lib/hasInconvertibleFromValidationSuccess";
import { mapConvertibleDetailsToPreviewSections } from "@features/google-form-conversion/lib/mapConvertibleDetailsToTransformedQuestions";
import { pickValidationSuccessForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import {
	isContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import { QuestionRenderer } from "@features/survey/pages/components/QuestionRenderer";
import { formatDateToISO } from "@shared/lib/FormatDate";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	CTAButton,
	FixedBottomCTA,
	List,
	ListHeader,
	ListRow,
	Text,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PreviewPage = () => {
	const navigate = useNavigate();
	const { validationResult } = useRequestEntryContext();
	const { formLink: formLinkCtx, email } = useRequestFormContext();

	const formLink = formLinkCtx.trim() ?? "";

	const isValidEntry =
		!!validationResult &&
		!!formLink &&
		isGoogleFormLinkUrl(formLink) &&
		isContactEmail(email ?? "");

	const validationSuccess = useMemo(() => {
		if (!validationResult || !formLink) return null;
		return pickValidationSuccessForFormLink(validationResult, formLink);
	}, [validationResult, formLink]);

	const previewSections = useMemo(() => {
		if (!validationSuccess?.convertibleDetails?.length) return [];
		return mapConvertibleDetailsToPreviewSections(
			validationSuccess.convertibleDetails,
		);
	}, [validationSuccess]);

	const inconvertibleDetails = useMemo(() => {
		const raw = validationSuccess?.inconvertibleDetails ?? [];
		return [...raw]
			.map((item, originalIndex) => ({ item, originalIndex }))
			.sort((a, b) => {
				const ao = a.item.questionOrder ?? Number.POSITIVE_INFINITY;
				const bo = b.item.questionOrder ?? Number.POSITIVE_INFINITY;
				if (ao !== bo) return ao - bo;
				return a.originalIndex - b.originalIndex;
			})
			.map(({ item }) => item);
	}, [validationSuccess]);

	const inconvertibleTotalCount = useMemo(() => {
		const detailsLen = inconvertibleDetails.length;
		const fromApi = validationSuccess?.inconvertible ?? 0;
		return Math.max(detailsLen, fromApi);
	}, [inconvertibleDetails.length, validationSuccess]);

	const hasInconvertible = useMemo(
		() => hasInconvertibleFromValidationSuccess(validationSuccess),
		[validationSuccess],
	);

	const firstInconvertibleHighlightLine = useMemo(() => {
		const d = inconvertibleDetails[0];
		if (!d) return null;
		const label = getQuestionNumberLabelForValidationDetail(d, 0);
		const title = d.title?.trim() ? d.title : "(제목 없음)";
		return `${label} ${title}`;
	}, [inconvertibleDetails]);

	const previewSectionRefMap = useRef(new Map<number, HTMLDivElement>());
	const [activePreviewSectionIndex, setActivePreviewSectionIndex] = useState(0);

	const getPreviewSectionDisplayNumber = useCallback(
		(sectionIdx: number) => {
			const s = previewSections[sectionIdx];
			if (!s) return sectionIdx + 1;
			return s.currSection >= 1 ? s.currSection : sectionIdx + 1;
		},
		[previewSections],
	);

	const scrollToPreviewSection = useCallback((index: number) => {
		const el = previewSectionRefMap.current.get(index);
		el?.scrollIntoView({ behavior: "smooth", block: "start" });
		setActivePreviewSectionIndex(index);
	}, []);

	const setPreviewSectionEl = useCallback(
		(index: number) => (el: HTMLDivElement | null) => {
			if (el) previewSectionRefMap.current.set(index, el);
			else previewSectionRefMap.current.delete(index);
		},
		[],
	);

	const updateActivePreviewSectionFromScroll = useCallback(() => {
		if (previewSections.length <= 1) return;
		const anchorY = 200;
		let next = 0;
		previewSections.forEach((_, i) => {
			const el = previewSectionRefMap.current.get(i);
			if (!el) return;
			const top = el.getBoundingClientRect().top;
			if (top <= anchorY) next = i;
		});
		setActivePreviewSectionIndex((prev) => (prev === next ? prev : next));
	}, [previewSections]);

	useEffect(() => {
		setActivePreviewSectionIndex((i) =>
			previewSections.length === 0
				? 0
				: Math.min(i, Math.max(0, previewSections.length - 1)),
		);
	}, [previewSections.length]);

	useEffect(() => {
		if (previewSections.length <= 1) return;
		updateActivePreviewSectionFromScroll();
		const onScroll = () => updateActivePreviewSectionFromScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [previewSections.length, updateActivePreviewSectionFromScroll]);

	const [isUnsupportedRegisterSheetOpen, setIsUnsupportedRegisterSheetOpen] =
		useState(false);
	const pendingAfterUnsupportedConfirmRef = useRef<(() => void) | null>(null);

	const handleUnsupportedRegisterSheetClose = useCallback(() => {
		pendingAfterUnsupportedConfirmRef.current = null;
		setIsUnsupportedRegisterSheetOpen(false);
	}, []);

	const handleUnsupportedRegisterContinue = useCallback(() => {
		const run = pendingAfterUnsupportedConfirmRef.current;
		pendingAfterUnsupportedConfirmRef.current = null;
		setIsUnsupportedRegisterSheetOpen(false);
		run?.();
	}, []);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	const questionIds = useMemo(
		() => previewSections.flatMap((s) => s.questions.map((q) => q.questionId)),
		[previewSections],
	);

	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [expandedQuestions, setExpandedQuestions] = useState<
		Record<number, boolean>
	>({});

	useEffect(() => {
		const next: Record<number, boolean> = {};
		questionIds.forEach((id) => {
			next[id] = true;
		});
		setExpandedQuestions(next);
	}, [questionIds]);

	const [selectedDateQuestionId, setSelectedDateQuestionId] = useState<
		number | null
	>(null);
	const [datePickerValue, setDatePickerValue] = useState<Date | null>(null);
	const datePickerContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (selectedDateQuestionId && datePickerContainerRef.current) {
			requestAnimationFrame(() => {
				const triggerButton = datePickerContainerRef.current?.querySelector(
					'button, [role="button"], input[type="button"]',
				) as HTMLElement;
				triggerButton?.click();
			});
		}
	}, [selectedDateQuestionId]);

	const updateAnswer = useCallback((questionId: number, value: string) => {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	}, []);

	const handleToggleExpand = useCallback((questionId: number) => {
		setExpandedQuestions((p) => ({
			...p,
			[questionId]: !p[questionId],
		}));
	}, []);

	const handleDatePickerOpen = useCallback(
		(questionId: number) => {
			const current = answers[questionId];
			setDatePickerValue(current ? new Date(current) : new Date());
			setSelectedDateQuestionId(questionId);
		},
		[answers],
	);

	const handleDateChange = useCallback(
		(date: Date) => {
			if (!selectedDateQuestionId) return;
			updateAnswer(selectedDateQuestionId, formatDateToISO(date));
			setSelectedDateQuestionId(null);
		},
		[selectedDateQuestionId, updateAnswer],
	);

	const handleContinueToOptions = useCallback(() => {
		const go = () => {
			navigate("/payment/google-form-conversion-options");
		};
		if (hasInconvertible) {
			pendingAfterUnsupportedConfirmRef.current = go;
			setIsUnsupportedRegisterSheetOpen(true);
			return;
		}
		go();
	}, [navigate, hasInconvertible]);

	const goToInquiry = useCallback(() => {
		navigate("/payment/google-form-conversion-inquiry");
	}, [navigate]);

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

	if (previewSections.length === 0 && !hasInconvertible) {
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
				<FixedBottomCTA
					onClick={() => navigate("/payment/google-form-conversion-options")}
				>
					이전으로
				</FixedBottomCTA>
			</>
		);
	}

	return (
		<>
			{inquiryListRow}

			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 미리보기
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15} color={adaptive.grey600}>
						변환된 문항을 실제 참여 화면과 같은 형태로 확인할 수 있어요
					</Top.SubtitleParagraph>
				}
			/>

			<div
				className={
					previewSections.length > 1 && hasInconvertible
						? "pb-64"
						: previewSections.length > 1
							? "pb-40"
							: hasInconvertible
								? "pb-52"
								: "pb-28"
				}
			>
				{previewSections.map((section, sectionIdx) => {
					const sectionNumber =
						section.currSection >= 1 ? section.currSection : sectionIdx + 1;
					const titleText = section.sectionTitle?.trim()
						? `섹션 ${sectionNumber} : ${section.sectionTitle}`
						: `섹션 ${sectionNumber}`;

					return (
						<div
							key={`${section.currSection}-${section.sectionTitle}-${sectionIdx}`}
							ref={setPreviewSectionEl(sectionIdx)}
							data-preview-section-index={sectionIdx}
						>
							{sectionIdx > 0 ? <Border variant="height16" /> : null}
							<ListHeader
								title={
									<ListHeader.TitleParagraph
										color={adaptive.grey800}
										fontWeight="bold"
										typography="t5"
									>
										<TextWithLinks
											text={titleText}
											variant="inline"
											inheritLinkSize
										/>
									</ListHeader.TitleParagraph>
								}
								titleWidthRatio={0.5}
								description={
									section.sectionDescription?.trim() ? (
										<ListHeader.DescriptionParagraph>
											<TextWithLinks
												text={section.sectionDescription}
												variant="inline"
											/>
										</ListHeader.DescriptionParagraph>
									) : undefined
								}
								descriptionPosition="bottom"
								rightAlignment="bottom"
							/>

							{section.questions.map((q) => (
								<div key={q.questionId} data-question-id={q.questionId}>
									<QuestionRenderer
										question={q}
										answer={answers[q.questionId]}
										onAnswerChange={updateAnswer}
										isExpanded={expandedQuestions[q.questionId] ?? true}
										onToggleExpand={() => handleToggleExpand(q.questionId)}
										onDatePickerOpen={() => handleDatePickerOpen(q.questionId)}
									/>
								</div>
							))}
						</div>
					);
				})}
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
				topAccessory={
					previewSections.length > 1 || hasInconvertible ? (
						<div className="w-full">
							<PreviewSectionNavBar
								sectionCount={previewSections.length}
								activeSectionIndex={activePreviewSectionIndex}
								getSectionDisplayNumber={getPreviewSectionDisplayNumber}
								onNavigateToSection={scrollToPreviewSection}
							/>
							{hasInconvertible ? (
								<PreviewInconvertibleQuestionBanner
									totalFailedCount={inconvertibleTotalCount}
									highlightLine={firstInconvertibleHighlightLine}
									compactTop={previewSections.length > 1}
								/>
							) : null}
						</div>
					) : undefined
				}
				leftButton={
					<CTAButton color="dark" variant="weak" onClick={() => navigate(-1)}>
						뒤로가기
					</CTAButton>
				}
				rightButton={
					<CTAButton onClick={handleContinueToOptions}>다음</CTAButton>
				}
			/>

			<UnsupportedRegisterConfirmBottomSheet
				open={isUnsupportedRegisterSheetOpen}
				onClose={handleUnsupportedRegisterSheetClose}
				onContinue={handleUnsupportedRegisterContinue}
			/>
		</>
	);
};
