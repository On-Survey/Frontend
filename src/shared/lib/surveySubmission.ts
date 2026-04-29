import type {
	SubmitSurveyParticipationAnswer,
	TransformedSurveyQuestion,
} from "@features/survey/service/surveyParticipation";

interface BuildSectionAnswersPayloadParams {
	questions: TransformedSurveyQuestion[];
	answers: Record<number, string>;
	previousAnswers: Record<number, string>;
}

/** 참여 화면에서 사용자 입력 필드가 없어 응답을 제출하지 않는 문항 */
export const isNonAnswerableParticipationQuestion = (
	question: Pick<TransformedSurveyQuestion, "type">,
): boolean => question.type === "image" || question.type === "title";

/**
 * 현재 섹션의 답변을 제출 형식으로 변환
 * - 객관식: 선택한 보기들을 각각 별도 항목으로 추가
 * - 객관식 해제: content를 null로 설정하여 해당 문항의 응답 삭제
 * - 텍스트 입력: 답변이 있으면 content, 지운 경우 빈 문자열로 설정하여 응답 삭제
 */
export const buildSectionAnswersPayload = ({
	questions,
	answers,
	previousAnswers,
}: BuildSectionAnswersPayloadParams): SubmitSurveyParticipationAnswer[] => {
	const payload: SubmitSurveyParticipationAnswer[] = [];
	const parseGridAnswer = (
		raw: string | undefined,
	): Record<string, string> | undefined => {
		if (!raw) return undefined;
		try {
			return JSON.parse(raw) as Record<string, string>;
		} catch {
			return undefined;
		}
	};

	questions.forEach((question) => {
		if (isNonAnswerableParticipationQuestion(question)) {
			return; // 이미지 전용 문항은 제출 항목 없음
		}
		const answer = answers[question.questionId];
		const previousAnswer = previousAnswers[question.questionId];

		if (question.type === "multipleChoice") {
			// 객관식 문항
			if (answer) {
				// 선택한 보기들을 각각 별도 항목으로 추가
				const selectedOptions = answer.split("|||").filter(Boolean);
				selectedOptions.forEach((option) => {
					payload.push({
						questionId: question.questionId,
						rowOrder: null,
						content: option,
					});
				});
			}

			// 이전에 답변했다가 해제한 경우 null로 추가 (해당 문항의 응답 삭제)
			if (previousAnswer && !answer) {
				const previousOptions = previousAnswer.split("|||").filter(Boolean);
				previousOptions.forEach(() => {
					payload.push({
						questionId: question.questionId,
						rowOrder: null,
						content: null,
					});
				});
			}
		} else if (
			question.type === "checkboxGrid" ||
			question.type === "multipleChoiceGrid"
		) {
			const rows = question.rows ?? [];
			const parsedAnswer = parseGridAnswer(answer) ?? {};
			const parsedPreviousAnswer = parseGridAnswer(previousAnswer) ?? {};

			rows.forEach((rowLabel, rowIndex) => {
				const currentRowAnswer = parsedAnswer[rowLabel] ?? "";
				const previousRowAnswer = parsedPreviousAnswer[rowLabel] ?? "";
				const selectedColumns = currentRowAnswer.split("|||").filter(Boolean);

				if (selectedColumns.length > 0) {
					selectedColumns.forEach((content) => {
						payload.push({
							questionId: question.questionId,
							rowOrder: rowIndex,
							content,
						});
					});
					return;
				}

				if (previousRowAnswer) {
					payload.push({
						questionId: question.questionId,
						rowOrder: rowIndex,
						content: "",
					});
				}
			});
		} else {
			// 텍스트 입력 문항 (단답형, 장문형, 숫자형 등)
			if (answer && answer.trim().length > 0) {
				payload.push({
					questionId: question.questionId,
					rowOrder: null,
					content: answer.trim(),
				});
			} else if (previousAnswer) {
				// 이전에 답변했다가 지운 경우 빈 문자열 또는 null (해당 문항의 응답 삭제)
				payload.push({
					questionId: question.questionId,
					rowOrder: null,
					content: "",
				});
			}
		}
	});

	return payload;
};
