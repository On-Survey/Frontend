import type { AgeCode } from "@features/payment/constants/payment";
import type { QuestionInfo } from "@shared/types/survey";

export const Interest = {
	CAREER: "CAREER",
	BUSINESS: "BUSINESS",
	FINANCE: "FINANCE",
	HEALTH: "HEALTH",
	CULTURE: "CULTURE",
	FASHION: "FASHION",
	SOCIETY: "SOCIETY",
	SELF_IMPROVEMENT: "SELF_IMPROVEMENT",
	DAILY_LIFE: "DAILY_LIFE",
} as const;

export type Interest = (typeof Interest)[keyof typeof Interest];

export interface createSurveyQuestionRequest {
	questionType:
		| "CHOICE"
		| "RATING"
		| "NPS"
		| "SHORT"
		| "LONG"
		| "DATE"
		| "NUMBER";
	title: string;
	description: string;
	questionOrder: number;
}

export interface ServerQuestionOption {
	optionId: number | null;
	content: string;
	nextQuestionId: number | null;
}

interface BaseServerQuestion {
	questionType:
		| "CHOICE"
		| "RATING"
		| "NPS"
		| "SHORT"
		| "LONG"
		| "DATE"
		| "NUMBER";
	title: string;
	description: string;
	questionOrder: number;
	required?: boolean;
	isRequired?: boolean;
	questionId?: number;
	surveyId?: number;
}

export interface ServerChoiceQuestion extends BaseServerQuestion {
	questionType: "CHOICE";
	option?: ServerQuestionOption[];
	options?: ServerQuestionOption[];
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
}

export interface ServerRatingQuestion extends BaseServerQuestion {
	questionType: "RATING";
	ratingLabels?: string[];
	minValue?: string;
	maxValue?: string;
	rate?: number;
}

export type ServerQuestion =
	| BaseServerQuestion
	| ServerChoiceQuestion
	| ServerRatingQuestion;

export type ServerQuestionRequest = ServerQuestion[];

export interface CreateSurveyResponse {
	surveyId?: number;
	result: {
		surveyId: number;
		title?: string;
		description?: string;
		totalCoin?: number;
		createdAt?: string;
	};
	title?: string;
	description?: string;
	totalCoin?: number;
	createdAt?: string;
}

export interface CreateFormRequest {
	deadline?: string;
	gender?: string;
	ages?: AgeCode[] | AgeCode[][];
	residence?: string;
	dueCount?: number;
	dueCountPrice?: number;
	genderPrice?: number;
	agePrice?: number;
	residencePrice?: number;
	totalCoin?: number;
}

export interface CreateFormResponse {
	surveyId?: number;
	title?: string;
	description?: string;
	totalCoin?: number;
	createdAt?: string;
}

export interface CreateFreeFormRequest {
	title?: string;
	description?: string;
}

export interface CreateSurveyQuestionResponse {
	success?: boolean;
	result: {
		questions?: Array<{ questionId?: number }>;
		questionId: number;
	};
	questions?: Array<{ questionId?: number }>;
}

export interface CreateScreeningsResponse {
	success?: boolean;
	result?: { screeningId?: number };
	screeningId?: number;
}

export interface CreateSurveyInterestsResponse {
	success?: boolean;
	result?: { interests?: string[] };
	interests?: string[];
}

export interface PatchSurveyRequest {
	surveyId: number;
	title: string;
	description: string;
}

export interface PatchSurveyResponse {
	surveyId?: number;
	result: { surveyId: number; title?: string; description?: string };
	title?: string;
	description?: string;
}

export type { QuestionInfo };
