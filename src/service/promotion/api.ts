import { apiCall } from "../axios/apiClient";

/**
 * 토스포인트 지급 요청 타입
 */
export interface IssuePromotionRequest {
	surveyId: number;
}

/**
 * 토스포인트 지급 응답 타입
 */
export interface IssuePromotionResponse {
	success: boolean;
	message?: string;
}

/**
 * 토스포인트 지급 실행
 * POST /toss/promotion/issue
 */
export const issuePromotion = async (
	request: IssuePromotionRequest,
): Promise<IssuePromotionResponse> => {
	return apiCall<IssuePromotionResponse>({
		method: "POST",
		url: "/toss/promotion/issue",
		data: request,
	});
};
