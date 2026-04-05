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

/**
 * 타임라인(`questionOrder`·`order`) 순으로 섹션별 행을 만든다.
 * 미변환 문항은 직전에 나온 변환 성공 문항이 속한 섹션에 붙는다.
 */
export const buildPreviewSectionBlocksFromValidation = (
	success: FormRequestValidationSuccessResultItem,
): GoogleFormPreviewSectionBlock[] => {
	const base = mapConvertibleDetailsToPreviewSections(
		success.convertibleDetails ?? [],
	);
	const timeline = buildValidationQuestionTimeline(success);

	const rowsBySection = new Map<number, PreviewSectionRow[]>();
	for (let i = 0; i < base.length; i++) {
		rowsBySection.set(i, []);
	}

	let lastSectionIndex = 0;
	let globalInconvertibleIndex = 0;

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
			if (!rowsBySection.has(lastSectionIndex)) {
				rowsBySection.set(lastSectionIndex, []);
			}
			const inconvertibleRows = rowsBySection.get(lastSectionIndex);
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
