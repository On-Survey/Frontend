import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import type {
	FormRequestValidationDetail,
	FormRequestValidationSuccessResultItem,
} from "../service/api";
import { buildValidationQuestionTimeline } from "./buildValidationQuestionTimeline";
import {
	type GoogleFormPreviewSection,
	mapConvertibleDetailsToPreviewSections,
	mapRawToPreviewQuestion,
} from "./mapConvertibleDetailsToTransformedQuestions";

export type PreviewSectionRow =
	| { kind: "question"; question: TransformedSurveyQuestion }
	| {
			kind: "inconvertible";
			detail: FormRequestValidationDetail;
			/** `getQuestionNumberLabelForValidationDetail`용 전역 미변환 목록 인덱스 */
			globalInconvertibleIndex: number;
	  };

export type GoogleFormPreviewSectionBlock = GoogleFormPreviewSection & {
	rows: PreviewSectionRow[];
};

const compareNumberAscNullLast = (a?: number | null, b?: number | null) => {
	const na = typeof a === "number" ? a : Number.POSITIVE_INFINITY;
	const nb = typeof b === "number" ? b : Number.POSITIVE_INFINITY;
	return na - nb;
};

const normalizeValidationSuccess = (
	success: FormRequestValidationSuccessResultItem,
): FormRequestValidationSuccessResultItem => {
	const convertibleDetails = [...(success.convertibleDetails ?? [])]
		.map((section) => ({
			...section,
			info: [...(section.info ?? [])].sort((qa, qb) =>
				compareNumberAscNullLast(qa.questionOrder, qb.questionOrder),
			),
		}))
		.sort((a, b) => compareNumberAscNullLast(a.currSection, b.currSection));

	const inconvertibleDetails = [...(success.inconvertibleDetails ?? [])].sort(
		(a, b) => {
			const sec = compareNumberAscNullLast(a.section, b.section);
			if (sec !== 0) return sec;
			return compareNumberAscNullLast(
				a.order ?? a.questionOrder,
				b.order ?? b.questionOrder,
			);
		},
	);

	return {
		...success,
		convertibleDetails,
		inconvertibleDetails,
	};
};

/**
 * 타임라인(`questionOrder`·`order`) 순으로 섹션별 행을 만든다.
 * 미변환 문항은 직전에 나온 변환 성공 문항이 속한 섹션에 붙는다.
 */
export const buildPreviewSectionBlocksFromValidation = (
	success: FormRequestValidationSuccessResultItem,
): GoogleFormPreviewSectionBlock[] => {
	const normalized = normalizeValidationSuccess(success);
	const base = mapConvertibleDetailsToPreviewSections(
		normalized.convertibleDetails ?? [],
	);
	const timeline = buildValidationQuestionTimeline(normalized);

	// currSection → base index 매핑 (백엔드 `detail.section`이 0/1-base 혼재할 수 있어 보정 후보를 둘 다 둔다)
	const sectionIndexByCurrSection = new Map<number, number>();
	for (let i = 0; i < base.length; i++) {
		sectionIndexByCurrSection.set(base[i]?.currSection ?? i + 1, i);
	}

	const rowsBySection = new Map<number, PreviewSectionRow[]>();
	for (let i = 0; i < base.length; i++) {
		rowsBySection.set(i, []);
	}

	let lastSectionIndex = 0;
	let globalInconvertibleIndex = 0;

	const resolveInconvertibleSectionIndex = (
		detail: FormRequestValidationDetail,
		fallbackIndex: number,
	): number => {
		const rawSection = detail.section;
		if (typeof rawSection !== "number") return fallbackIndex;
		return (
			sectionIndexByCurrSection.get(rawSection) ??
			sectionIndexByCurrSection.get(rawSection + 1) ??
			fallbackIndex
		);
	};

	for (const entry of timeline) {
		if (entry.kind === "convertible") {
			lastSectionIndex = entry.sectionIndex;
			if (!rowsBySection.has(lastSectionIndex)) {
				rowsBySection.set(lastSectionIndex, []);
			}
			const question = mapRawToPreviewQuestion(
				entry.question,
				entry.section,
				entry.sectionIndex,
				entry.questionIndex,
			);
			const convertibleRows = rowsBySection.get(lastSectionIndex);
			if (convertibleRows) {
				convertibleRows.push({ kind: "question", question });
			}
		} else {
			const targetSectionIndex = resolveInconvertibleSectionIndex(
				entry.detail,
				lastSectionIndex,
			);
			if (!rowsBySection.has(targetSectionIndex)) {
				rowsBySection.set(targetSectionIndex, []);
			}
			const inconvertibleRows = rowsBySection.get(targetSectionIndex);
			if (inconvertibleRows) {
				inconvertibleRows.push({
					kind: "inconvertible",
					detail: entry.detail,
					globalInconvertibleIndex: globalInconvertibleIndex++,
				});
			}
		}
	}

	if (base.length === 0) {
		const details = success.inconvertibleDetails ?? [];
		if (details.length === 0) return [];
		return [
			{
				currSection: 1,
				sectionTitle: "미지원 문항",
				sectionDescription: "",
				questions: [],
				rows: details.map((detail, globalInconvertibleIndex) => ({
					kind: "inconvertible" as const,
					detail,
					globalInconvertibleIndex,
				})),
			},
		];
	}

	return base.map((b, i) => ({
		...b,
		rows:
			rowsBySection.get(i) ??
			b.questions.map((q) => ({ kind: "question" as const, question: q })),
	}));
};
