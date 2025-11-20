import type { AgeCode } from "../../constants/payment";
import type { QuestionInfo } from "../../types/survey";

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

// 서버 요청용 질문 옵션
export interface ServerQuestionOption {
	optionId: number | null;
	content: string;
	nextQuestionId: number | null;
}

// 서버 요청용 질문 타입 (공통 필드)
interface BaseServerQuestion {
	questionType:
		| "CHOICE"
		| "RATING"
		| "NPS"
		| "SHORT"
		| "LONG"
		| "DATE"
		| "NUMBER";
	questionId: number;
	surveyId: number;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
}

// 서버 요청용 CHOICE 질문
export interface ServerChoiceQuestion extends BaseServerQuestion {
	questionType: "CHOICE";
	maxChoice: number;
	hasNoneOption: boolean;
	hasCustomInput: boolean;
	options: ServerQuestionOption[];
}

// 서버 요청용 RATING 질문
export interface ServerRatingQuestion extends BaseServerQuestion {
	questionType: "RATING";
	minValue: string;
	maxValue: string;
}

// 서버 요청용 기타 질문 (SHORT, LONG, DATE, NUMBER, NPS)
export type ServerOtherQuestion = BaseServerQuestion & {
	questionType: "SHORT" | "LONG" | "DATE" | "NUMBER" | "NPS";
};

// 서버 요청용 질문 유니온
export type ServerQuestion =
	| ServerChoiceQuestion
	| ServerRatingQuestion
	| ServerOtherQuestion;

// 서버 요청용 질문 리스트
export interface ServerQuestionRequest {
	questions: ServerQuestion[];
}

interface BaseResponse {
	code: number;
	message: string;
}

export interface CreateSurveyResponse extends BaseResponse {
	result: {
		surveyId: number;
		title: string;
		description: string;
		errorClass?: string; // 예시
		errorMessage?: string; // 예시
	};
	success: boolean;
}

export interface CreateSurveyQuestionResponse extends BaseResponse {
	result: {
		surveyId: number;
		info: [
			{
				questionId: number;
				title: string;
				description: string;
				isRequired: boolean;
				questionType: string;
				questionOrder: number;
				maxChoice: number;
				hasNoneOption: boolean;
				hasCustomInput: boolean;
				options: [
					{
						optionId: number;
						content: string;
						nextQuestionId: number;
					},
				];
				minValue: string;
				maxValue: string;
				defaultDate: string;
			},
		];
	};

	success: boolean;
}

export interface CreateScreeningsResponse extends BaseResponse {
	result:
		| {
				screeningId: number;
				surveyId: number;
				content: string;
				answer: boolean;
				errorClass?: string;
				errorMessage?: string;
		  }
		| string;
	success: boolean;
}

export interface CreateFormResponse extends BaseResponse {
	result:
		| {
				formId: number;
				surveyId: number;
				errorClass?: string;
				errorMessage?: string;
		  }
		| string
		| boolean;
	success: boolean;
}

export interface CreateFormRequest {
	deadline: string;
	gender: string;
	genderPrice: number;
	ages: AgeCode[];
	agePrice: number;
	residence: string;
	residencePrice: number;
	dueCount: number;
	dueCountPrice: number;
	totalCoin: number;
}

export interface SaveAsDraftResponse extends BaseResponse {
	result:
		| {
				surveyId: number;
				errorClass?: string;
				errorMessage?: string;
				info?: QuestionInfo;
		  }
		| string
		| boolean;
	success: boolean;
}

export enum Interest {
	CAREER = "CAREER",
	BUSINESS = "BUSINESS",
	FINANCE = "FINANCE",
	HEALTH = "HEALTH",
	CULTURE = "CULTURE",
	FASHION = "FASHION",
	SOCIETY = "SOCIETY",
	SELF_IMPROVEMENT = "SELF_IMPROVEMENT",
	DAILY_LIFE = "DAILY_LIFE",
}

export interface CreateSurveyInterestsResponse extends BaseResponse {
	result: {
		surveyId: number;
		interests: Interest[];
	};
	success: boolean;
}
