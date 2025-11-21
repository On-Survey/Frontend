import { apiCall } from "../axios/apiClient";
import type {
	GlobalStats,
	ImpendingSurveyResult,
	OngoingSurveyResult,
	RecommendedSurveyResult,
} from "./types";

export interface GetOngoingSurveysParams {
	lastSurveyId?: number;
	size?: number;
}

const DEFAULT_PARAMS: Required<GetOngoingSurveysParams> = {
	lastSurveyId: 0,
	size: 15,
};

//노출 중인 설문 목록을 조회
export const getOngoingSurveys = async (
	params: GetOngoingSurveysParams = {},
): Promise<OngoingSurveyResult> => {
	const merged = { ...DEFAULT_PARAMS, ...params };

	return apiCall<{
		recommended: OngoingSurveyResult["recommended"];
		impending: OngoingSurveyResult["impending"];
		recommendedHasNext: boolean;
		impendingHasNext: boolean;
	}>({
		method: "GET",
		url: "/v1/survey-participation/surveys/ongoing",
		params: merged,
	}) as Promise<OngoingSurveyResult>;
};

// 맞춤 설문 목록을 조회
export interface GetRecommendedSurveysParams {
	lastSurveyId?: number;
	size?: number;
}

export const getRecommendedSurveys = async (
	params: GetRecommendedSurveysParams = {},
): Promise<RecommendedSurveyResult> => {
	const merged = { ...DEFAULT_PARAMS, ...params };

	return apiCall<RecommendedSurveyResult>({
		method: "GET",
		url: "/v1/survey-participation/surveys/ongoing/recommended",
		params: merged,
	});
};

// 마감 임박 설문 목록을 조회
export interface GetImpendingSurveysParams {
	lastSurveyId?: number;
	lastDeadline?: string;
	size?: number;
}

export const getImpendingSurveys = async (
	params: GetImpendingSurveysParams = {},
): Promise<ImpendingSurveyResult> => {
	const merged = { ...DEFAULT_PARAMS, ...params };

	return apiCall<ImpendingSurveyResult>({
		method: "GET",
		url: "/v1/survey-participation/surveys/ongoing/impending",
		params: merged,
	});
};

// 전체 설문 전역 통계 조회
export const getGlobalStats = async (): Promise<GlobalStats> => {
	return apiCall<GlobalStats>({
		method: "GET",
		url: "/v1/surveys/global-stats",
	});
};
