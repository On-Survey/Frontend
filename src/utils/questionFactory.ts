import type { Question, QuestionType } from "../types/survey";

// 문항 타입에 따른 기본 질문 생성
export const createQuestion = (
	questionType: QuestionType,
	title: string,
): Question => {
	const baseQuestion = {
		id: crypto.randomUUID(),
		type: questionType,
		title,
		required: true,
		order: 0, // addQuestion에서 자동으로 설정됨
	};

	switch (questionType) {
		case "multiple_choice":
			return {
				...baseQuestion,
				type: "multiple_choice",
				options: [
					{ id: crypto.randomUUID(), text: "옵션 1" },
					{ id: crypto.randomUUID(), text: "옵션 2" },
				],
				allowSelection: 1,
			};
		case "rating":
			return {
				...baseQuestion,
				type: "rating",
				config: {
					leftLabel: "매우 나쁨",
					rightLabel: "매우 좋음",
					scale: 10,
				},
			};
		case "nps":
			return {
				...baseQuestion,
				type: "nps",
				scale: 10,
			};
		case "short_answer":
			return {
				...baseQuestion,
				type: "short_answer",
			};
		case "essay":
			return {
				...baseQuestion,
				type: "essay",
			};
		case "date":
			return {
				...baseQuestion,
				type: "date",
				choiceDate: "",
			};
		case "number":
			return {
				...baseQuestion,
				type: "number",
				value: 0,
			};
		default:
			throw new Error(`지원하지 않는 문항 타입: ${questionType}`);
	}
};
