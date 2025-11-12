import type { QuestionInfo } from "../../types/survey";

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
	result:
		| {
				surveyId: number;
				questionId: number;
				order: number;
				title: string;
				type: string;
				errorClass?: string;
				errorMessage?: string;
		  }
		| string;
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
