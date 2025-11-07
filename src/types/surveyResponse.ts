import type { QuestionType } from "./survey";

// 설문 응답 상세 데이터 타입
export interface SurveyResponseDetail {
	id: number;
	title: string;
	status: "active" | "closed";
	responseCount: number;
	questions: SurveyResponseQuestion[];
}

export interface SurveyResponseQuestion {
	id: string;
	title: string;
	type: QuestionType;
	required: boolean;
	responseCount: number;
}

// 배지 설정 타입
export type SurveyStatus = "active" | "closed";

export type BadgeColor = "blue" | "elephant";

export interface BadgeConfig {
	color: BadgeColor;
}
