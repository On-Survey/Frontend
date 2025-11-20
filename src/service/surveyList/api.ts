import { apiCall } from "../axios/apiClient";
import type { GlobalStats, OngoingSurveyResult } from "./types";

export interface GetOngoingSurveysParams {
	lastSurveyId?: number;
	size?: number;
}

const DEFAULT_PARAMS: Required<GetOngoingSurveysParams> = {
	lastSurveyId: 0,
	size: 15,
};

//노출 중인 설문 목록을 조회합니다.
export const getOngoingSurveys = async (
	params: GetOngoingSurveysParams = {},
): Promise<OngoingSurveyResult> => {
	const merged = { ...DEFAULT_PARAMS, ...params };

	return apiCall<{
		recommended: OngoingSurveyResult["recommended"];
		impending: OngoingSurveyResult["impending"];
		hasNext: boolean;
	}>({
		method: "GET",
		url: "/v1/survey-participation/surveys/ongoing",
		params: merged,
	}) as Promise<OngoingSurveyResult>;
};

// 전체 설문 전역 통계 조회
export const getGlobalStats = async (): Promise<GlobalStats> => {
	return apiCall<GlobalStats>({
		method: "GET",
		url: "/v1/surveys/global-stats",
	});
};
