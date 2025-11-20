import type { WritingQuestion } from "../service/mysurvey/types";
import type { Question } from "../types/survey";

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
		TEXT: "shortAnswer",
	};

	return typeMap[serverType] ?? "shortAnswer";
};

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

	if (writingQuestion.questionType === "CHOICE" && writingQuestion.options) {
		return {
			...baseQuestion,
			type: "multipleChoice",
			maxChoice: writingQuestion.maxChoice ?? 1,
			hasCustomInput: false,
			hasOtherOption: false,
			option: writingQuestion.options.map((opt, idx) => ({
				optionId: opt.optionId ?? null,
				order: idx,
				content: opt.content,
				nextQuestionId: opt.nextQuestionId ?? null,
			})),
		};
	}

	if (writingQuestion.questionType === "RATING") {
		return {
			...baseQuestion,
			type: "rating",
			minValue: String(writingQuestion.minValue ?? "1"),
			maxValue: String(writingQuestion.maxValue ?? "10"),
		};
	}

	if (writingQuestion.questionType === "DATE") {
		return {
			...baseQuestion,
			type: "date",
			date: writingQuestion.defaultDate
				? new Date(writingQuestion.defaultDate)
				: new Date(),
		};
	}

	if (writingQuestion.questionType === "NUMBER") {
		return {
			...baseQuestion,
			type: "number",
		};
	}

	if (writingQuestion.questionType === "NPS") {
		return {
			...baseQuestion,
			type: "nps",
		};
	}

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

	return {
		...baseQuestion,
		type: "shortAnswer",
	};
};

export const convertWritingQuestionsToQuestions = (
	writingQuestions: WritingQuestion[],
): Question[] => {
	return writingQuestions.map(convertWritingQuestionToQuestion);
};
