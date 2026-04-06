import type { GoogleFormPreviewSectionBlock } from "@features/google-form-conversion/lib/buildPreviewSectionBlocksFromValidation";
import { getQuestionNumberLabelForValidationDetail } from "@features/google-form-conversion/lib/getQuestionNumberLabelForValidationDetail";
import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FlatInconvertible = {
	sectionIndex: number;
	globalInconvertibleIndex: number;
	detail: FormRequestValidationDetail;
};

const buildFlatInconvertibles = (
	blocks: GoogleFormPreviewSectionBlock[],
): FlatInconvertible[] => {
	const out: FlatInconvertible[] = [];
	blocks.forEach((block, sectionIndex) => {
		for (const row of block.rows) {
			if (row.kind === "inconvertible") {
				out.push({
					sectionIndex,
					globalInconvertibleIndex: row.globalInconvertibleIndex,
					detail: row.detail,
				});
			}
		}
	});
	out.sort((a, b) => a.globalInconvertibleIndex - b.globalInconvertibleIndex);
	return out;
};

type GoToPreviewSectionFn = (
	index: number,
	options?: { skipScrollTop?: boolean },
) => void;

/**
 * 현재 섹션에 미변환만 있을 때 하단 배너 표시, 화살표로 전역 순 미변환 이동·섹션 동기화
 */
export const useGoogleFormPreviewInconvertibleBanner = ({
	previewSectionBlocks,
	activePreviewSectionIndex,
	goToPreviewSection,
}: {
	previewSectionBlocks: GoogleFormPreviewSectionBlock[];
	activePreviewSectionIndex: number;
	goToPreviewSection: GoToPreviewSectionFn;
}) => {
	const flatOrdered = useMemo(
		() => buildFlatInconvertibles(previewSectionBlocks),
		[previewSectionBlocks],
	);

	const inconvertiblesInCurrentSection = useMemo(() => {
		const block = previewSectionBlocks[activePreviewSectionIndex];
		if (!block) return [];
		return block.rows.filter((r) => r.kind === "inconvertible");
	}, [previewSectionBlocks, activePreviewSectionIndex]);

	const showBanner = inconvertiblesInCurrentSection.length > 0;

	const [cursorGlobalIndex, setCursorGlobalIndex] = useState<number | null>(
		null,
	);
	const skipSnapCursorToFirstInSectionRef = useRef(false);

	useEffect(() => {
		if (skipSnapCursorToFirstInSectionRef.current) {
			skipSnapCursorToFirstInSectionRef.current = false;
			return;
		}
		const block = previewSectionBlocks[activePreviewSectionIndex];
		if (!block) {
			setCursorGlobalIndex(null);
			return;
		}
		const first = block.rows.find((r) => r.kind === "inconvertible");
		if (!first) {
			setCursorGlobalIndex(null);
			return;
		}
		setCursorGlobalIndex(first.globalInconvertibleIndex);
	}, [activePreviewSectionIndex, previewSectionBlocks]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 섹션 전환 직후 동일 globalIndex로 DOM이 바뀌면 다시 스크롤해야 함
	useEffect(() => {
		if (cursorGlobalIndex === null || !showBanner) return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				document
					.querySelector(
						`[data-preview-inconvertible-global="${String(cursorGlobalIndex)}"]`,
					)
					?.scrollIntoView({ block: "center", behavior: "smooth" });
			});
		});
	}, [cursorGlobalIndex, activePreviewSectionIndex, showBanner]);

	const highlightLine = useMemo(() => {
		if (cursorGlobalIndex === null || !showBanner) return null;
		const row = inconvertiblesInCurrentSection.find(
			(r) => r.globalInconvertibleIndex === cursorGlobalIndex,
		);
		if (!row) return null;
		const localIdx = inconvertiblesInCurrentSection.findIndex(
			(r) => r.globalInconvertibleIndex === cursorGlobalIndex,
		);
		const label = getQuestionNumberLabelForValidationDetail(
			row.detail,
			localIdx,
		);
		const title = row.detail.title?.trim() ? row.detail.title : "(제목 없음)";
		return `${label} ${title}`;
	}, [cursorGlobalIndex, showBanner, inconvertiblesInCurrentSection]);

	const flatIndex = useMemo(() => {
		if (cursorGlobalIndex === null) return -1;
		return flatOrdered.findIndex(
			(x) => x.globalInconvertibleIndex === cursorGlobalIndex,
		);
	}, [flatOrdered, cursorGlobalIndex]);

	const canGoPrev = flatIndex > 0;
	const canGoNext = flatIndex >= 0 && flatIndex < flatOrdered.length - 1;

	const handleBannerPrev = useCallback(() => {
		if (cursorGlobalIndex === null || !canGoPrev) return;
		const target = flatOrdered[flatIndex - 1];
		if (!target) return;
		skipSnapCursorToFirstInSectionRef.current = true;
		if (target.sectionIndex !== activePreviewSectionIndex) {
			goToPreviewSection(target.sectionIndex, { skipScrollTop: true });
		}
		setCursorGlobalIndex(target.globalInconvertibleIndex);
	}, [
		cursorGlobalIndex,
		canGoPrev,
		flatOrdered,
		flatIndex,
		activePreviewSectionIndex,
		goToPreviewSection,
	]);

	const handleBannerNext = useCallback(() => {
		if (cursorGlobalIndex === null || !canGoNext) return;
		const target = flatOrdered[flatIndex + 1];
		if (!target) return;
		skipSnapCursorToFirstInSectionRef.current = true;
		if (target.sectionIndex !== activePreviewSectionIndex) {
			goToPreviewSection(target.sectionIndex, { skipScrollTop: true });
		}
		setCursorGlobalIndex(target.globalInconvertibleIndex);
	}, [
		cursorGlobalIndex,
		canGoNext,
		flatOrdered,
		flatIndex,
		activePreviewSectionIndex,
		goToPreviewSection,
	]);

	return {
		showBanner,
		sectionFailedCount: inconvertiblesInCurrentSection.length,
		highlightLine,
		canGoPrev,
		canGoNext,
		onBannerPrev: handleBannerPrev,
		onBannerNext: handleBannerNext,
	};
};
