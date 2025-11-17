import { apiCall } from "../axios/apiClient";
import type { SurveyDetailResult, SurveyManagementResult } from "./types";

/**
 * 내 설문 목록 조회
 * GET /v1/survey-management
 */
export const getSurveyManagement =
	async (): Promise<SurveyManagementResult> => {
		try {
			return await apiCall<SurveyManagementResult>({
				method: "GET",
				url: "/v1/survey-management",
			});
		} catch (error) {
			console.error("설문 목록 조회 실패:", error);
			throw error;
		}
	};

/**
 * 내 설문 상세 조회
 * GET /v1/survey-management/{surveyId}
 */
export const getSurveyDetail = async (
	surveyId: number,
): Promise<SurveyDetailResult> => {
	try {
		return await apiCall<SurveyDetailResult>({
			method: "GET",
			url: `/v1/survey-management/${surveyId}`,
		});
	} catch (error) {
		console.error("설문 상세 조회 실패:", error);
		throw error;
	}
};

/**
 * 내 설문 결제 환불
 * POST /v1/survey-management/{surveyId}/refund
 */
export const refundSurvey = async (surveyId: number): Promise<boolean> => {
	try {
		return await apiCall<boolean>({
			method: "POST",
			url: `/v1/survey-management/${surveyId}/refund`,
		});
	} catch (error) {
		console.error("설문 환불 실패:", error);
		throw error;
	}
};
