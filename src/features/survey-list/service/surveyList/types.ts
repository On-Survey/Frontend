export interface BaseResponse {
	code: number | string;
	message: string;
	success: boolean;
}

import type { InterestId } from "@shared/constants/topics";

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
	isEligible?: boolean; // 세그먼트 일치 여부 (true: 일치, false: 불일치)
	price?: number;
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

/** GET /v1/surveys/open-stats — 비인증, 노출 가능 설문 수 + 최대 리워드 코인 */
export interface SurveyOpenStats {
	openSurveyCount: number;
	maxRewardCoin: number;
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

// 모든 설문 조회 API 응답 (세그먼트 불일치 포함)
export interface AllOngoingSurveysResult {
	surveys: OngoingSurveySummary[];
	hasNext: boolean;
}

export interface AllOngoingSurveysResponse extends BaseResponse {
	result: AllOngoingSurveysResult;
}
