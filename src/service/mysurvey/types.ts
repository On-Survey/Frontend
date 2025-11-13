interface BaseResponse {
	code: number | string;
	message: string;
	success: boolean;
}

export interface OngoingSurveySummary {
	surveyId: number;
	memberId: number;
	title: string;
	description: string;
}

export interface OngoingSurveyResult {
	recommended: OngoingSurveySummary[];
	impending: OngoingSurveySummary[];
	hasNext: boolean;
}

export interface OngoingSurveyResponse extends BaseResponse {
	result: OngoingSurveyResult;
}

export interface SurveyQuestionInfo {
	questionId: number;
	surveyId: number;
	type: string;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
}

export interface SurveyDetailResult {
	info: SurveyQuestionInfo[];
}

export interface SurveyDetailResponse extends BaseResponse {
	result: SurveyDetailResult;
}

export interface ScreeningQuestionSummary {
	screeningId: number;
	surveyId: number;
	content: string;
	answer: boolean;
}

export interface ScreeningQuestionResult {
	data: ScreeningQuestionSummary[];
	hasNext: boolean;
}

export interface ScreeningQuestionResponse extends BaseResponse {
	result: ScreeningQuestionResult;
}

export interface SurveyResponseInfo {
	questionId: number;
	content: string;
}

export interface SubmitSurveyResponsePayload {
	infoList: SurveyResponseInfo[];
}

export interface SubmitSurveyResponse extends BaseResponse {
	result: boolean;
}
