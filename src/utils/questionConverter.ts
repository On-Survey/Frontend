import type {
	ServerChoiceQuestion,
	ServerQuestion,
	ServerQuestionOption,
} from "../service/form/types";
import type { MultipleChoiceQuestion, Question } from "../types/survey";
import { isMultipleChoiceQuestion, isRatingQuestion } from "../types/survey";
import { mapQuestionTypeToServerFormat } from "./questionTypeUtils";

/**
 * 클라이언트 질문 옵션을 서버 형식으로 변환
 */
const convertOptionsToServerFormat = (
	options: MultipleChoiceQuestion["option"],
): ServerQuestionOption[] => {
	return options.map((option) => ({
		optionId: 0, // 새로 생성하는 경우 0으로 설정 (서버에서 ID 할당)
		content: option.content,
		nextQuestionId: option.nextQuestionId,
	}));
};

/**
 * 클라이언트 질문을 서버 요청 형식으로 변환
 */
export const convertQuestionToServerFormat = (
	question: Question,
	surveyId: number,
): ServerQuestion => {
	const baseQuestion = {
		questionType: mapQuestionTypeToServerFormat(question.type),
		questionId: question.questionId,
		surveyId,
		title: question.title,
		description: question.description,
		isRequired: question.isRequired,
		questionOrder: question.questionOrder,
	};

	// CHOICE 타입 처리
	if (isMultipleChoiceQuestion(question)) {
		return {
			...baseQuestion,
			questionType: "CHOICE",
			maxChoice: question.maxChoice,
			hasNoneOption: false, // TODO: 클라이언트 타입에 추가 필요
			hasCustomInput: false, // TODO: 클라이언트 타입에 추가 필요
			options: convertOptionsToServerFormat(question.option),
		} as ServerChoiceQuestion;
	}

	// RATING 타입 처리
	if (isRatingQuestion(question)) {
		return {
			...baseQuestion,
			questionType: "RATING",
			minValue: question.minValue,
			maxValue: question.maxValue,
		} as ServerQuestion;
	}

	// 기타 타입 (SHORT, LONG, DATE, NUMBER, NPS)
	return baseQuestion as ServerQuestion;
};

/**
 * 클라이언트 질문 배열을 서버 요청 형식으로 변환
 */
export const convertQuestionsToServerFormat = (
	questions: Question[],
	surveyId: number,
): ServerQuestion[] => {
	return questions.map((question) =>
		convertQuestionToServerFormat(question, surveyId),
	);
};
