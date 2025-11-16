import { api } from "../axios";
import type {
	SurveyDetailResponse,
	SurveyDetailResult,
	SurveyManagementResponse,
	SurveyManagementResult,
} from "./types";

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

/**
 * 내 설문 상세 조회
 * GET /v1/survey-management/{surveyId}
 */
export const getSurveyDetail = async (
	surveyId: number,
): Promise<SurveyDetailResult> => {
	try {
		const response = await api.get<SurveyDetailResponse>(
			`/v1/survey-management/${surveyId}`,
		);
		const serverResponse = response.data as unknown as SurveyDetailResponse;

		if (serverResponse.success && serverResponse.result) {
			return serverResponse.result;
		}

		throw new Error(serverResponse.message || "설문 상세 조회에 실패했습니다.");
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
		const response = await api.post<{ result: boolean }>(
			`/v1/survey-management/${surveyId}/refund`,
		);
		type RefundApiPayload = {
			success?: boolean;
			result?: boolean;
			message?: string;
			data?: { result?: boolean };
		};
		const payload: RefundApiPayload =
			response.data as unknown as RefundApiPayload;
		const successInWrapped = payload?.success === true;
		const resultInWrapped = payload?.data?.result === true;
		const successDirect = payload?.success === true;
		const resultDirect = payload?.result === true;

		if (
			(successInWrapped && resultInWrapped) ||
			(successDirect && resultDirect)
		) {
			return true;
		}
		throw new Error(payload?.message || "환불에 실패했습니다.");
	} catch (error) {
		console.error("설문 환불 실패:", error);
		throw error;
	}
};
