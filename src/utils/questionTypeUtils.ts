import type { Question } from "../types/survey";

/**
 * 클라이언트 측 질문 타입을 서버 API 형식으로 변환
 * @param type 클라이언트 측 질문 타입
 * @returns 서버 API 형식의 질문 타입
 */
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
