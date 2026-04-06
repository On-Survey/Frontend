import { PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE } from "@features/google-form-conversion/components/PreviewInconvertibleSectionRow";
import type { GoogleFormPreviewSectionBlock } from "@features/google-form-conversion/lib/buildPreviewSectionBlocksFromValidation";
import { formatDateToISO } from "@shared/lib/FormatDate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseGoogleFormPreviewQuestionsParams = {
	previewSectionBlocks: GoogleFormPreviewSectionBlock[];
};

/**
 * 미리보기 문항 답·펼침·숨김 날짜 피커 트리거
 */
export const useGoogleFormPreviewQuestions = ({
	previewSectionBlocks,
}: UseGoogleFormPreviewQuestionsParams) => {
	const questionIds = useMemo(
		() =>
			previewSectionBlocks.flatMap((block) =>
				block.rows
					.filter((r) => r.kind === "question")
					.map((r) => r.question.questionId),
			),
		[previewSectionBlocks],
	);

	const inconvertibleExpandIds = useMemo(
		() =>
			previewSectionBlocks.flatMap((block) =>
				block.rows
					.filter((r) => r.kind === "inconvertible")
					.map(
						(r) =>
							PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE + r.globalInconvertibleIndex,
					),
			),
		[previewSectionBlocks],
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
		inconvertibleExpandIds.forEach((id) => {
			next[id] = true;
		});
		setExpandedQuestions(next);
	}, [questionIds, inconvertibleExpandIds]);

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
			setAnswers((prev) => ({
				...prev,
				[selectedDateQuestionId]: formatDateToISO(date),
			}));
			setSelectedDateQuestionId(null);
		},
		[selectedDateQuestionId],
	);

	return {
		answers,
		expandedQuestions,
		updateAnswer,
		handleToggleExpand,
		datePickerContainerRef,
		datePickerValue,
		handleDatePickerOpen,
		handleDateChange,
	};
};
