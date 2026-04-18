import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";

/**
 * 분기 문항·API nextSection을 반영해 다음 섹션 번호를 계산한다.
 * 반환값이 0이면 마지막 섹션으로 간주한다.
 */
export function calculateNextSection(
	questions: TransformedSurveyQuestion[],
	answers: Record<number, string>,
	currentSection: number,
	nextSectionFromApi?: number,
): number {
	const decidableQuestion = questions.find(
		(q: TransformedSurveyQuestion) => q.isSectionDecidable,
	);
	const hasDecidableAnswer =
		decidableQuestion !== undefined &&
		decidableQuestion.type === "multipleChoice" &&
		answers[decidableQuestion.questionId] !== undefined;

	if (hasDecidableAnswer && decidableQuestion) {
		const answerValue = answers[decidableQuestion.questionId];
		if (answerValue) {
			const selected = answerValue.split("|||").filter(Boolean);
			const option = decidableQuestion.options?.find(
				(o) => selected.includes(o.content) && o.nextSection !== undefined,
			);
			if (option?.nextSection !== undefined) {
				return option.nextSection;
			}
		}
	}

	if (questions.length === 0) {
		if (
			nextSectionFromApi != null &&
			nextSectionFromApi > 0 &&
			nextSectionFromApi !== currentSection
		) {
			return nextSectionFromApi;
		}
		if (nextSectionFromApi === currentSection) {
			return currentSection + 1;
		}
		if (nextSectionFromApi === 0) {
			return currentSection + 1;
		}
		return nextSectionFromApi ?? currentSection + 1;
	}

	return nextSectionFromApi ?? currentSection + 1;
}
