import { useGoogleFormConversion } from "@features/google-form-conversion/context/GoogleFormConversionContext";
import { mapConvertibleDetailsToPreviewSections } from "@features/google-form-conversion/lib/mapConvertibleDetailsToTransformedQuestions";
import { pickValidationSuccessForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import {
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import { QuestionRenderer } from "@features/survey/pages/components/QuestionRenderer";
import { formatDateToISO } from "@shared/lib/FormatDate";
import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	Text,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionPreviewPage = () => {
	const navigate = useNavigate();
	const {
		formLink: formLinkCtx,
		email,
		validationResult,
	} = useGoogleFormConversion();

	console.log("validationResult", validationResult);

	const formLink = formLinkCtx?.trim() ?? "";

	const isValidEntry =
		!!validationResult &&
		!!formLink &&
		isGoogleFormLinkUrl(formLink) &&
		isGoogleFormConversionContactEmail(email ?? "");

	const previewSections = useMemo(() => {
		if (!validationResult) return [];
		const success = pickValidationSuccessForFormLink(
			validationResult,
			formLink,
		);
		if (!success?.convertibleDetails?.length) return [];
		return mapConvertibleDetailsToPreviewSections(success.convertibleDetails);
	}, [validationResult, formLink]);

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

	const handleContinue = useCallback(() => {
		navigate("/payment/google-form-conversion-options");
	}, [navigate]);

	if (!isValidEntry) {
		return null;
	}

	if (previewSections.length === 0) {
		return (
			<>
				<Top
					title={
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							설문 미리보기
						</Top.TitleParagraph>
					}
				/>
				<div className="px-6 pt-6">
					<Text color={adaptive.grey700} typography="t6">
						변환된 문항을 불러올 수 없어요. 구글폼 검증을 다시 진행해 주세요.
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
			<Border variant="height16" />

			<div className="pb-24">
				{previewSections.map((section, sectionIdx) => (
					<div key={`${section.currSection}-${section.sectionTitle}`}>
						{sectionIdx > 0 ? <Border variant="height16" /> : null}
						<Top
							title={
								<Top.TitleParagraph size={22} color={adaptive.grey900}>
									<TextWithLinks
										text={section.sectionTitle}
										variant="inline"
										inheritLinkSize
									/>
								</Top.TitleParagraph>
							}
							subtitleBottom={
								section.sectionDescription ? (
									<Top.SubtitleParagraph size={15}>
										<TextWithLinks
											text={section.sectionDescription}
											variant="inline"
										/>
									</Top.SubtitleParagraph>
								) : undefined
							}
						/>
						<Border variant="height16" />
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

			<FixedBottomCTA onClick={handleContinue}>다음 단계로</FixedBottomCTA>
		</>
	);
};
