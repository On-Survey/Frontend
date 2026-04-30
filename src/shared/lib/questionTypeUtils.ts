import type { Question } from "../types/survey";

export const mapQuestionTypeToServerFormat = (
	type: Question["type"],
):
	| "CHOICE"
	| "RATING"
	| "NPS"
	| "SHORT"
	| "LONG"
	| "DATE"
	| "TIME"
	| "NUMBER"
	| "IMAGE"
	| "GRID"
	| "TITLE" => {
	const typeMap: Record<
		Question["type"],
		| "CHOICE"
		| "RATING"
		| "NPS"
		| "SHORT"
		| "LONG"
		| "DATE"
		| "TIME"
		| "NUMBER"
		| "IMAGE"
		| "GRID"
		| "TITLE"
	> = {
		multipleChoice: "CHOICE",
		rating: "RATING",
		nps: "NPS",
		shortAnswer: "SHORT",
		longAnswer: "LONG",
		date: "DATE",
		time: "TIME",
		number: "NUMBER",
		image: "IMAGE",
		checkboxGrid: "GRID",
		multipleChoiceGrid: "GRID",
		title: "TITLE",
	};
	return typeMap[type];
};
