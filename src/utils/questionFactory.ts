import type { Question, QuestionType } from "../types/survey";

// 문항 타입에 따른 기본 질문 생성
export const createQuestion = (
	questionType: QuestionType,
	title: string,
	surveyId: number = 0,
	questionOrder: number = 0,
): Question => {
	const baseQuestion = {
		surveyId,
		questionId: Date.now(),
		type: questionType,
		title,
		description: "",
		isRequired: true,
		questionOrder,
	};

	switch (questionType) {
		case "multipleChoice":
			return {
				...baseQuestion,
				type: "multipleChoice",
				maxChoice: 1,
				option: [
					{ order: 1, content: "옵션 1", nextQuestionId: 0 },
					{ order: 2, content: "옵션 2", nextQuestionId: 0 },
				],
			};
		case "rating":
			return {
				...baseQuestion,
				type: "rating",
				minValue: "매우 나쁨",
				maxValue: "매우 좋음",
			};
		case "nps":
			return {
				...baseQuestion,
				type: "nps",
			};
		case "shortAnswer":
			return {
				...baseQuestion,
				type: "shortAnswer",
			};
		case "longAnswer":
			return {
				...baseQuestion,
				type: "longAnswer",
			};
		case "date":
			return {
				...baseQuestion,
				type: "date",
				date: new Date(),
			};
		case "number":
			return {
				...baseQuestion,
				type: "number",
			};
		default:
			throw new Error(`지원하지 않는 문항 타입: ${questionType}`);
	}
};
