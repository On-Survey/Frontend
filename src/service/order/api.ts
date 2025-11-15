import { api } from "../axios";
import type { SurveyManagementResponse, SurveyManagementResult } from "./types";

/**
 * 내 설문 목록 조회
 * GET /v1/survey-management
 */
export const getSurveyManagement =
	async (): Promise<SurveyManagementResult> => {
		try {
			const response = await api.get<SurveyManagementResponse>(
				"/v1/survey-management",
			);
			const serverResponse =
				response.data as unknown as SurveyManagementResponse;

			if (serverResponse.success && serverResponse.result) {
				return serverResponse.result;
			}

			throw new Error(
				serverResponse.message || "설문 목록 조회에 실패했습니다.",
			);
		} catch (error) {
			console.error("설문 목록 조회 실패:", error);
			throw error;
		}
	};
