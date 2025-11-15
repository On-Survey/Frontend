/**
 * 설문 상태 타입
 */
export type SurveyStatus = "ONGOING" | "CLOSED" | "REFUNDED";

/**
 * 설문 정보 타입
 */
export interface Survey {
	surveyId: number;
	title: string;
	status: SurveyStatus;
	totalCoin: number;
	createdDate: string;
}

/**
 * 설문 관리 API 응답 타입
 */
export interface SurveyManagementResult {
	totalCount: number;
	refundedCount: number;
	ongoingSurveys: Survey[];
	refundedSurveys: Survey[];
}

/**
 * 설문 관리 API 응답 타입
 */
export interface SurveyManagementResponse {
	code: number;
	message: string;
	result: SurveyManagementResult;
	success: boolean;
}
