export interface BaseResponse {
	code: number | string;
	message: string;
	success: boolean;
}

import type { InterestId } from "../../constants/topics";

export interface OngoingSurveySummary {
	surveyId: number;
	memberId: number;
	title: string;
	description: string;
	interest?: InterestId;
	interests?: InterestId[];
	deadline?: string;
}

export interface OngoingSurveyResult {
	recommended: OngoingSurveySummary[];
	impending: OngoingSurveySummary[];
	recommendedHasNext: boolean;
	impendingHasNext: boolean;
}

export interface RecommendedSurveyResult {
	data: OngoingSurveySummary[];
	hasNext: boolean;
}

export interface ImpendingSurveyResult {
	data: OngoingSurveySummary[];
	hasNext: boolean;
}

export interface OngoingSurveyResponse extends BaseResponse {
	result: OngoingSurveyResult;
}
