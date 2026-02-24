import type { QuestionType } from "./survey";

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
	order?: number;
}

export type SurveyStatus = "active" | "closed";

export type BadgeColor = "blue" | "elephant";

export interface BadgeConfig {
	color: BadgeColor;
}

// Result 페이지에서 사용하는 state 타입
export interface ResultPageState {
	question: {
		id: number;
		title: string;
		description: string;
		type: string;
		isRequired: boolean;
		order: number;
		rate?: number;
	};
	answerMap?: Record<string, number>;
	answerList?: string[];
	surveyTitle: string;
	surveyStatus: "active" | "closed";
	responseCount: number; // 실제 응답자 수 (respondentCount)
	totalAnswerCount?: number; // 총 답변 수 (복수 선택 시 responseCount보다 많을 수 있음)
	surveyId?: number;
	filters?: {
		ages?: string[];
		genders?: string[];
		residences?: string[];
	};
}
