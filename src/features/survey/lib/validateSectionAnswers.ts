import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { isNonAnswerableParticipationQuestion } from "@shared/lib/surveySubmission";

const REQUIRED_ERROR_MESSAGE = "해당 문항을 완료해주세요";
const GRID_REQUIRED_ERROR_MESSAGE =
	"이 질문에서는 행마다 최소한 하나의 응답을 작성해야 해요.";
const GRID_COLUMN_VIOLATION_MESSAGE = "열당 응답을 두개 이상 선택하지 마세요";

const ANSWER_SEPARATOR = "|||";

export interface QuestionForValidation {
	questionId: number;
	isRequired?: boolean;
	type?: TransformedSurveyQuestion["type"];
	rows?: string[]; // 그리드 문항 행 목록
	columns?: string[]; // 그리드 문항 열 목록
}

const isGridQuestion = (
	type: TransformedSurveyQuestion["type"] | undefined,
): boolean => type === "checkboxGrid" || type === "multipleChoiceGrid";

/** 그리드 답변에서 모든 행에 하나 이상의 응답이 있는지 확인 */
const isGridAnswerComplete = (
	answer: string | undefined,
	rows: string[],
): boolean => {
	if (!answer) return false;
	try {
		const parsed = JSON.parse(answer) as Record<string, string>;
		return rows.every((row) => parsed[row] && parsed[row].trim().length > 0);
	} catch {
		return false;
	}
};

/** 체크박스 그리드에서 동일한 열이 2개 이상의 행에 선택됐는지 확인 */
const hasColumnViolation = (
	answer: string | undefined,
	rows: string[],
	columns: string[],
): boolean => {
	if (!answer) return false;
	try {
		const parsed = JSON.parse(answer) as Record<string, string>;
		return columns.some((col) => {
			const count = rows.filter((row) => {
				const val = parsed[row] ?? "";
				return val.split(ANSWER_SEPARATOR).includes(col);
			}).length;
			return count > 1;
		});
	} catch {
		return false;
	}
};

/**
 * 섹션 내 필수 문항 답변 검증
 * - 이미지 전용 문항(image)은 답변이 없어도 통과
 * - 체크박스 그리드: 동일 열이 2행 이상 선택되면 에러 (필수 여부 무관)
 * - 그리드 문항: 필수인 경우 모든 행에 하나 이상의 응답이 있어야 통과
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

		if (isGridQuestion(q.type)) {
			const rows = q.rows ?? [];
			const columns = q.columns ?? [];

			// 열 중복 선택 위반 (체크박스 그리드, 필수 여부 무관하게 항상 검사)
			if (q.type === "checkboxGrid" && hasColumnViolation(a, rows, columns)) {
				errors[q.questionId] = GRID_COLUMN_VIOLATION_MESSAGE;
			} else if (q.isRequired && !isGridAnswerComplete(a, rows)) {
				// 필수인데 미응답 행 존재
				errors[q.questionId] = GRID_REQUIRED_ERROR_MESSAGE;
			}
		} else if (q.isRequired && (!a || !a.trim())) {
			errors[q.questionId] = REQUIRED_ERROR_MESSAGE;
		}
	}

	return errors;
}
