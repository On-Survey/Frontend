import { apiCall } from "../axios/apiClient";
import type {
	SubmitSurveyParticipationPayload,
	SurveyParticipationInfo,
} from "./types";

export interface GetSurveyParticipationParams {
	surveyId: number;
}

/**
 * 선택한 설문 문항을 조회합니다.
 * GET /v1/survey-participation/surveys
 */
export const getSurveyParticipation = async (
	params: GetSurveyParticipationParams,
): Promise<SurveyParticipationInfo> => {
	return apiCall<SurveyParticipationInfo>({
		method: "GET",
		url: "/v1/survey-participation/surveys",
		params,
	});
};

/**
 * 설문에 대한 응답 생성
 * POST /v1/survey-participation/surveys/{surveyId}
 */
export const submitSurveyParticipation = async (
	surveyId: number,
	infoList: SubmitSurveyParticipationPayload["infoList"],
): Promise<void> => {
	await apiCall<void>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}`,
		data: { infoList },
	});
};
