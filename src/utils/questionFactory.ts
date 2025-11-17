import type { Question, QuestionType } from "../types/survey";

/**
 * API의 질문 타입을 컴포넌트의 QuestionType으로 변환
 */
export const mapApiQuestionTypeToComponentType = (
	apiType: string,
): QuestionType => {
	const typeMap: Record<string, QuestionType> = {
		CHOICE: "multipleChoice",
		SHORT_ANSWER: "shortAnswer",
		LONG_ANSWER: "longAnswer",
		RATING: "rating",
		NPS: "nps",
		DATE: "date",
		NUMBER: "number",
	};

	return typeMap[apiType] || "shortAnswer";
};

export const getQuestionTypeLabel = (type: Question["type"]): string => {
	const typeLabels: Record<Question["type"], string> = {
		multipleChoice: "객관식",
		rating: "평가형",
		nps: "NPS",
		shortAnswer: "주관식 (단답형)",
		longAnswer: "주관식 (장문형)",
		date: "날짜",
		number: "숫자",
	};
	return typeLabels[type];
};

export const formatQuestionNumber = (order: number): string => {
	return String(order).padStart(2, "0");
};

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
