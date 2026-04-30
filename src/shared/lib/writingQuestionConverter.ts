import type { WritingQuestion } from "../../features/mysurvey/service/mysurvey/types";
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
		TIME: "time",
		NUMBER: "number",
		TEXT: "shortAnswer",
		GRID: "multipleChoiceGrid",
	};

	return typeMap[serverType] ?? "shortAnswer";
};

export const convertWritingQuestionToQuestion = (
	writingQuestion: WritingQuestion,
): Question => {
	const mappedType =
		writingQuestion.questionType === "GRID"
			? writingQuestion.isCheckbox
				? "checkboxGrid"
				: "multipleChoiceGrid"
			: mapServerQuestionTypeToClient(writingQuestion.questionType);

	const baseQuestion = {
		surveyId: writingQuestion.surveyId,
		questionId: writingQuestion.questionId,
		type: mappedType,
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
			rate: Number(writingQuestion.rate ?? "10"),
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

	if (writingQuestion.questionType === "TIME") {
		return {
			...baseQuestion,
			type: "time",
			isInterval: writingQuestion.isInterval ?? false,
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

	if (writingQuestion.questionType === "GRID") {
		const sortedGridOptions = [...(writingQuestion.gridOptions ?? [])].sort(
			(a, b) => a.order - b.order,
		);
		const rows = sortedGridOptions
			.filter((option) => option.isRow)
			.map((option) => option.content);
		const columns = sortedGridOptions
			.filter((option) => !option.isRow)
			.map((option) => option.content);

		return {
			...baseQuestion,
			type: writingQuestion.isCheckbox ? "checkboxGrid" : "multipleChoiceGrid",
			rows,
			columns,
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
