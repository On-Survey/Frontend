import type {
	SubmitSurveyParticipationAnswer,
	TransformedSurveyQuestion,
} from "../service/surveyParticipation";

interface BuildSectionAnswersPayloadParams {
	questions: TransformedSurveyQuestion[];
	answers: Record<number, string>;
	previousAnswers: Record<number, string>;
}

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

	questions.forEach((question) => {
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
						content: null,
					});
				});
			}
		} else {
			// 텍스트 입력 문항 (단답형, 장문형, 숫자형 등)
			if (answer && answer.trim().length > 0) {
				payload.push({
					questionId: question.questionId,
					content: answer.trim(),
				});
			} else if (previousAnswer) {
				// 이전에 답변했다가 지운 경우 빈 문자열 또는 null (해당 문항의 응답 삭제)
				payload.push({
					questionId: question.questionId,
					content: "",
				});
			}
		}
	});

	return payload;
};
