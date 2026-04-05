import type { GoogleFormPreviewSectionBlock } from "@features/google-form-conversion/lib/buildPreviewSectionBlocksFromValidation";
import { getFirstTimelineInconvertiblePreviewPlacement } from "@features/google-form-conversion/lib/getFirstTimelineInconvertiblePreviewPlacement";
import type { FormRequestValidationSuccessResultItem } from "@features/google-form-conversion/service/api";
import { useCallback, useEffect, useRef, useState } from "react";

type UseGoogleFormPreviewSectionNavParams = {
	previewSectionBlocks: GoogleFormPreviewSectionBlock[];
	validationSuccess: FormRequestValidationSuccessResultItem | null;
	focusFirstInconvertibleFromNav: boolean;
	locationKey: string;
};

/**
 * 단일 섹션 표시, 섹션 전환 시 스크롤, 바텀시트 진입 시 첫 미변환 행 포커스
 */
export const useGoogleFormPreviewSectionNav = ({
	previewSectionBlocks,
	validationSuccess,
	focusFirstInconvertibleFromNav,
	locationKey,
}: UseGoogleFormPreviewSectionNavParams) => {
	const [activePreviewSectionIndex, setActivePreviewSectionIndex] = useState(0);
	const skipScrollTopOnceAfterFocusRef = useRef(false);

	const getPreviewSectionDisplayNumber = useCallback(
		(sectionIdx: number) => {
			const s = previewSectionBlocks[sectionIdx];
			if (!s) return sectionIdx + 1;
			return s.currSection >= 1 ? s.currSection : sectionIdx + 1;
		},
		[previewSectionBlocks],
	);

	useEffect(() => {
		setActivePreviewSectionIndex((i) =>
			previewSectionBlocks.length === 0
				? 0
				: Math.min(i, Math.max(0, previewSectionBlocks.length - 1)),
		);
	}, [previewSectionBlocks.length]);

	const goToPreviewSection = useCallback((index: number) => {
		setActivePreviewSectionIndex(index);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 인덱스가 바뀔 때마다(클램프 포함) 본문 상단으로 스크롤
	useEffect(() => {
		if (skipScrollTopOnceAfterFocusRef.current) {
			skipScrollTopOnceAfterFocusRef.current = false;
			return;
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [activePreviewSectionIndex]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 동일 state로 재진입 시에도 바텀시트→미리보기 포커스를 다시 적용하려면 `locationKey` 필요
	useEffect(() => {
		if (!focusFirstInconvertibleFromNav || !validationSuccess) return;
		if (previewSectionBlocks.length === 0) return;
		const placement =
			getFirstTimelineInconvertiblePreviewPlacement(validationSuccess);
		if (!placement) return;
		setActivePreviewSectionIndex((prev) => {
			if (prev !== placement.sectionIndex) {
				skipScrollTopOnceAfterFocusRef.current = true;
				return placement.sectionIndex;
			}
			return prev;
		});
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const el = document.querySelector(
					`[data-preview-inconvertible-global="${String(placement.globalInconvertibleIndex)}"]`,
				);
				el?.scrollIntoView({ block: "center", behavior: "smooth" });
			});
		});
	}, [
		focusFirstInconvertibleFromNav,
		validationSuccess,
		previewSectionBlocks.length,
		locationKey,
	]);

	const activePreviewBlock =
		previewSectionBlocks[activePreviewSectionIndex] ?? null;

	return {
		activePreviewSectionIndex,
		activePreviewBlock,
		getPreviewSectionDisplayNumber,
		goToPreviewSection,
	};
};
