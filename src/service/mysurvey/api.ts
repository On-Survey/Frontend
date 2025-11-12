import { api } from "../axios";
import type { OngoingSurveyResponse, OngoingSurveyResult } from "./types";

export interface GetOngoingSurveysParams {
	lastSurveyId?: number;
	size?: number;
}

const DEFAULT_PARAMS: Required<GetOngoingSurveysParams> = {
	lastSurveyId: 0,
	size: 15,
};

/**
 * 노출 중인 설문 목록을 조회합니다.
 * @description GET /v1/survey-participation/surveys/ongoing
 */
export const getOngoingSurveys = async (
	params: GetOngoingSurveysParams = {},
): Promise<OngoingSurveyResult> => {
	const mergedParams = {
		...DEFAULT_PARAMS,
		...params,
	};

	const { data } = await api.get<OngoingSurveyResponse>(
		"/v1/survey-participation/surveys/ongoing",
		{
			params: mergedParams,
		},
	);

	return (data as unknown as OngoingSurveyResponse).result;
};
