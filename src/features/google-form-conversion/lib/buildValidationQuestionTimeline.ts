import type {
	FormRequestValidationConvertibleQuestionInfo,
	FormRequestValidationConvertibleSection,
	FormRequestValidationDetail,
	FormRequestValidationSuccessResultItem,
} from "../service/api";

/** `questionOrder`·`order`가 없을 때 섹션·문항 위치로 임시 순위 부여 */
const fallbackConvertibleSortKey = (
	sectionIndex: number,
	questionIndex: number,
) => sectionIndex * 10_000 + questionIndex;

export type ValidationQuestionTimelineConvertibleEntry = {
	kind: "convertible";
	/** 정렬에 사용한 값 (`question.questionOrder` 우선) */
	sortKey: number;
	/** `sortKey`가 같을 때 원본 나열 순서 유지 */
	stableIndex: number;
	sectionIndex: number;
	questionIndex: number;
	section: FormRequestValidationConvertibleSection;
	question: FormRequestValidationConvertibleQuestionInfo;
};

export type ValidationQuestionTimelineInconvertibleEntry = {
	kind: "inconvertible";
	/** 정렬에 사용한 값 (`detail.order` → `detail.questionOrder`) */
	sortKey: number;
	stableIndex: number;
	detail: FormRequestValidationDetail;
};

export type ValidationQuestionTimelineEntry =
	| ValidationQuestionTimelineConvertibleEntry
	| ValidationQuestionTimelineInconvertibleEntry;

/**
 * 검증 성공 행의 변환 가능 문항(`questionOrder`)과 미변환 문항(`order`)을
 * 같은 순번 축으로 합쳐 오름차순 타임라인을 만든다.
 */
export const buildValidationQuestionTimeline = (
	success: FormRequestValidationSuccessResultItem,
): ValidationQuestionTimelineEntry[] => {
	const entries: ValidationQuestionTimelineEntry[] = [];
	let stableIndex = 0;

	(success.convertibleDetails ?? []).forEach((section, sectionIndex) => {
		(section.info ?? []).forEach((question, questionIndex) => {
			const sortKey =
				question.questionOrder ??
				fallbackConvertibleSortKey(sectionIndex, questionIndex);
			entries.push({
				kind: "convertible",
				sortKey,
				stableIndex: stableIndex++,
				sectionIndex,
				questionIndex,
				section,
				question,
			});
		});
	});

	for (const detail of success.inconvertibleDetails ?? []) {
		const sortKey =
			detail.order ?? detail.questionOrder ?? Number.MAX_SAFE_INTEGER;
		entries.push({
			kind: "inconvertible",
			sortKey,
			stableIndex: stableIndex++,
			detail,
		});
	}

	entries.sort((a, b) => {
		if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
		return a.stableIndex - b.stableIndex;
	});
	return entries;
};
