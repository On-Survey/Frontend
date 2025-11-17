import type { WritingQuestion } from "../service/mysurvey/types";
import type { Question } from "../types/survey";

/**
 * 서버의 WritingQuestionType을 클라이언트 QuestionType으로 변환
 */
const mapServerQuestionTypeToClient = (
	serverType: WritingQuestion["questionType"],
): Question["type"] => {
	const typeMap: Record<WritingQuestion["questionType"], Question["type"]> = {
		CHOICE: "multipleChoice",
		RATING: "rating",
		NPS: "nps",
		SHORT: "shortAnswer",
		LONG: "longAnswer",
		DATE: "date",
		NUMBER: "number",
		TEXT: "shortAnswer", // TEXT는 단답형으로 처리
	};

	return typeMap[serverType] ?? "shortAnswer";
};

/**
 * 서버의 WritingQuestion을 클라이언트 Question으로 변환
 */
export const convertWritingQuestionToQuestion = (
	writingQuestion: WritingQuestion,
): Question => {
	const baseQuestion = {
		surveyId: writingQuestion.surveyId,
		questionId: writingQuestion.questionId,
		type: mapServerQuestionTypeToClient(writingQuestion.questionType),
		title: writingQuestion.title,
		description: writingQuestion.description,
		isRequired: writingQuestion.isRequired,
		questionOrder: writingQuestion.questionOrder,
	};

	// CHOICE 타입 처리
	if (writingQuestion.questionType === "CHOICE" && writingQuestion.options) {
		return {
			...baseQuestion,
			type: "multipleChoice",
			maxChoice: writingQuestion.maxChoice ?? 1,
			option: writingQuestion.options.map((opt, idx) => ({
				order: idx,
				content: opt.content,
				nextQuestionId: opt.nextQuestionId ?? 0,
			})),
		};
	}

	// RATING 타입 처리
	if (writingQuestion.questionType === "RATING") {
		return {
			...baseQuestion,
			type: "rating",
			minValue: String(writingQuestion.minValue ?? "1"),
			maxValue: String(writingQuestion.maxValue ?? "10"),
		};
	}

	// DATE 타입 처리
	if (writingQuestion.questionType === "DATE") {
		return {
			...baseQuestion,
			type: "date",
			date: writingQuestion.date ? new Date(writingQuestion.date) : new Date(),
		};
	}

	// NUMBER 타입 처리
	if (writingQuestion.questionType === "NUMBER") {
		return {
			...baseQuestion,
			type: "number",
		};
	}

	// NPS 타입 처리
	if (writingQuestion.questionType === "NPS") {
		return {
			...baseQuestion,
			type: "nps",
		};
	}

	// SHORT, LONG, TEXT 타입 처리
	if (
		writingQuestion.questionType === "SHORT" ||
		writingQuestion.questionType === "TEXT"
	) {
		return {
			...baseQuestion,
			type: "shortAnswer",
		};
	}

	if (writingQuestion.questionType === "LONG") {
		return {
			...baseQuestion,
			type: "longAnswer",
		};
	}

	// 기본값: 단답형
	return {
		...baseQuestion,
		type: "shortAnswer",
	};
};

/**
 * 서버의 WritingQuestion 배열을 클라이언트 Question 배열로 변환
 */
export const convertWritingQuestionsToQuestions = (
	writingQuestions: WritingQuestion[],
): Question[] => {
	return writingQuestions.map(convertWritingQuestionToQuestion);
};
