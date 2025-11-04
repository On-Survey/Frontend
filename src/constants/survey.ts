import type { BadgeConfig, SurveyStatus } from "../types/surveyResponse";

// 설문 상태별 배지 설정
export const SURVEY_BADGE_CONFIG: Record<SurveyStatus, BadgeConfig> = {
	active: { color: "blue" },
	closed: { color: "elephant" },
};

// 설문 상태별 라벨
export const SURVEY_STATUS_LABELS: Record<SurveyStatus, string> = {
	active: "노출중",
	closed: "마감",
};

// 질문 타입별 라벨
export const QUESTION_TYPE_LABELS: Record<string, string> = {
	shortAnswer: "주관식 단답형",
	longAnswer: "주관식 서술형",
	multipleChoice: "객관식",
	rating: "평가형",
	nps: "NPS",
	date: "날짜",
	number: "숫자",
};
