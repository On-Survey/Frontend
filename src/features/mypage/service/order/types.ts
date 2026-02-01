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
	deadline: string;
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

/**
 * 설문 상세 정보 타입
 */
export interface SurveyInfo {
	dueCount: number;
	dueCountPrice: number;
	gender: "ALL" | "MALE" | "FEMALE";
	genderPrice: number;
	ages: string[];
	agePrice: number;
	residence: "ALL" | string;
	residencePrice: number;
}

/**
 * 설문 상세 조회 결과 타입
 */
export interface SurveyDetailResult {
	surveyId: number;
	title: string;
	status: SurveyStatus;
	totalCoin: number;
	createdAt: string;
	surveyInfo: SurveyInfo;
}

/**
 * 설문 상세 조회 API 응답 타입
 */
export interface SurveyDetailResponse {
	code: number;
	message: string;
	result: SurveyDetailResult;
	success: boolean;
}
