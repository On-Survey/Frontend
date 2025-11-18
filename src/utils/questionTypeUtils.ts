import type { Question } from "../types/survey";

export const mapQuestionTypeToServerFormat = (
	type: Question["type"],
): "CHOICE" | "RATING" | "NPS" | "SHORT" | "LONG" | "DATE" | "NUMBER" => {
	const typeMap: Record<
		Question["type"],
		"CHOICE" | "RATING" | "NPS" | "SHORT" | "LONG" | "DATE" | "NUMBER"
	> = {
		multipleChoice: "CHOICE",
		rating: "RATING",
		nps: "NPS",
		shortAnswer: "SHORT",
		longAnswer: "LONG",
		date: "DATE",
		number: "NUMBER",
	};
	return typeMap[type];
};
