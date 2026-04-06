import type { FormRequestValidationSuccessResultItem } from "../service/api";
import { buildValidationQuestionTimeline } from "./buildValidationQuestionTimeline";
import { mapConvertibleDetailsToPreviewSections } from "./mapConvertibleDetailsToTransformedQuestions";

/**
 * `buildPreviewSectionBlocksFromValidation`과 동일한 타임라인 순서로
 * 첫 미변환 문항이 붙는 섹션 인덱스와 해당 행의 `globalInconvertibleIndex`를 반환한다.
 */
export const getFirstTimelineInconvertiblePreviewPlacement = (
	success: FormRequestValidationSuccessResultItem,
): { sectionIndex: number; globalInconvertibleIndex: number } | null => {
	const base = mapConvertibleDetailsToPreviewSections(
		success.convertibleDetails ?? [],
	);

	if (base.length === 0) {
		const details = success.inconvertibleDetails ?? [];
		if (details.length === 0) return null;
		return { sectionIndex: 0, globalInconvertibleIndex: 0 };
	}

	const timeline = buildValidationQuestionTimeline(success);
	let lastSectionIndex = 0;

	for (const entry of timeline) {
		if (entry.kind === "convertible") {
			lastSectionIndex = entry.sectionIndex;
		} else {
			/* `buildPreviewSectionBlocksFromValidation`와 같이 타임라인 순 첫 미변환은 항상 index 0 */
			return { sectionIndex: lastSectionIndex, globalInconvertibleIndex: 0 };
		}
	}

	return null;
};
