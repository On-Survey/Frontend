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
	| "NUMBER"
	| "IMAGE"
	| "TITLE" => {
	const typeMap: Record<
		Question["type"],
		| "CHOICE"
		| "RATING"
		| "NPS"
		| "SHORT"
		| "LONG"
		| "DATE"
		| "NUMBER"
		| "IMAGE"
		| "TITLE"
	> = {
		multipleChoice: "CHOICE",
		rating: "RATING",
		nps: "NPS",
		shortAnswer: "SHORT",
		longAnswer: "LONG",
		date: "DATE",
		number: "NUMBER",
		image: "IMAGE",
		title: "TITLE",
	};
	return typeMap[type];
};
