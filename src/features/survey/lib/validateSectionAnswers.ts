import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { isNonAnswerableParticipationQuestion } from "@shared/lib/surveySubmission";

const REQUIRED_ERROR_MESSAGE = "해당 문항을 완료해주세요";

export interface QuestionForValidation {
	questionId: number;
	isRequired?: boolean;
	type?: TransformedSurveyQuestion["type"];
}

/**
 * 섹션 내 필수 문항 답변 검증
 * - 이미지 전용 문항(image)은 답변이 없어도 통과
 * @returns 검증 에러 맵 (questionId -> 에러 메시지), 비어 있으면 통과
 */
export function validateSectionAnswers(
	questions: QuestionForValidation[],
	answers: Record<number, string>,
): Record<number, string> {
	const errors: Record<number, string> = {};

	for (const q of questions) {
		if (
			q.type !== undefined &&
			isNonAnswerableParticipationQuestion({ type: q.type })
		) {
			continue; // 이미지 전용 문항은 답변 불필요
		}
		const a = answers[q.questionId];
		if (q.isRequired && (!a || !a.trim())) {
			errors[q.questionId] = REQUIRED_ERROR_MESSAGE;
		}
	}

	return errors;
}
