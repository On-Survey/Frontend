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
	hasNext: boolean;
}

export interface OngoingSurveyResponse extends BaseResponse {
	result: OngoingSurveyResult;
}

export interface GlobalStats {
	totalDueCount: number;
	totalCompletedCount: number;
	totalPromotionCount: number;
}

export interface GlobalStatsResponse extends BaseResponse {
	result: GlobalStats;
}
