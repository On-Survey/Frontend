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
	isFree?: boolean;
	responseCount?: number;
}

export interface OngoingSurveyResult {
	recommended: OngoingSurveySummary[];
	impending: OngoingSurveySummary[];
	recommendedHasNext: boolean;
	impendingHasNext: boolean;
}

export interface RecommendedSurveyResult {
	data?: OngoingSurveySummary[];
	recommended?: OngoingSurveySummary[];
	hasNext?: boolean;
	recommendedHasNext?: boolean;
}

export interface ImpendingSurveyResult {
	data?: OngoingSurveySummary[];
	impending?: OngoingSurveySummary[];
	hasNext?: boolean;
	impendingHasNext?: boolean;
}

export interface OngoingSurveyResponse extends BaseResponse {
	result: OngoingSurveyResult;
}

export interface GlobalStats {
	totalDueCount: number;
	totalCompletedCount: number;
	totalPromotionCount: number;
	dailyUserCount: number;
}

export interface GlobalStatsResponse extends BaseResponse {
	result: GlobalStats;
}
