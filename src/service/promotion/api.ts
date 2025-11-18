import { apiCall } from "../axios/apiClient";

export interface IssuePromotionRequest {
	surveyId: number;
}

export interface IssuePromotionResponse {
	success: boolean;
	message?: string;
}

//토스포인트 지급
export const issuePromotion = async (
	request: IssuePromotionRequest,
): Promise<IssuePromotionResponse> => {
	return apiCall<IssuePromotionResponse>({
		method: "POST",
		url: "/toss/promotion/issue",
		data: request,
	});
};
