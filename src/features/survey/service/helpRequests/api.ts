import { api } from "@shared/api/axios";

/** POST /v1/surveys/help-requests 요청 바디 (설문 반려 도움 요청) */
export interface SurveyHelpRequestBody {
	email: string;
	name: string;
	rejectionReasons: string[];
	content: string;
}

/** POST /v1/surveys/help-requests 응답 바디 */
export interface SurveyHelpRequestResponse {
	code: number;
	message: string;
	result: string;
	success: boolean;
}

/**
 * 설문 반려 도움 요청 — POST /v1/surveys/help-requests
 */
export const postSurveyHelpRequest = async (
	body: SurveyHelpRequestBody,
): Promise<SurveyHelpRequestResponse> => {
	const { data } = await api.post<
		SurveyHelpRequestResponse,
		SurveyHelpRequestBody
	>("/v1/surveys/help-requests", body);
	return data;
};
