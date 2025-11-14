import { apiCall } from "../axios/apiClient";
import type {
	OngoingSurveyResult,
	ScreeningQuestionResult,
	SubmitSurveyResponsePayload,
	SurveyAnswerDetailResult,
	SurveyDetailResult,
} from "./types";

const DEFAULT_ONGOING_PARAMS = { lastSurveyId: 0, size: 15 };
const DEFAULT_SCREENING_PARAMS = { lastSurveyId: 0, size: 5 };

// 노출 중인 설문 목록 조회
export const getOngoingSurveys = async (
	params = {},
): Promise<OngoingSurveyResult> => {
	return apiCall<OngoingSurveyResult>({
		method: "GET",
		url: "/v1/survey-participation/surveys/ongoing",
		params: { ...DEFAULT_ONGOING_PARAMS, ...params },
	});
};

// 설문 상세 조회
export const getSurveyDetail = async (
	surveyId: number,
): Promise<SurveyDetailResult> => {
	return apiCall<SurveyDetailResult>({
		method: "GET",
		url: "/v1/survey-participation/surveys",
		params: { surveyId },
	});
};

// 설문 응답 제출
export const submitSurveyResponse = async (
	surveyId: number,
	body: SubmitSurveyResponsePayload,
): Promise<boolean> => {
	return apiCall<boolean>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}`,
		data: body,
	});
};

// 스크리닝 문항 조회
export const getScreeningQuestions = async (
	params = {},
): Promise<ScreeningQuestionResult> => {
	return apiCall<ScreeningQuestionResult>({
		method: "GET",
		url: "/v1/survey-participation/surveys/screenings",
		params: { ...DEFAULT_SCREENING_PARAMS, ...params },
	});
};

// 사용자가 생성한 설문 조회
export interface UserSurvey {
	surveyId: number;
	title: string;
	description: string;
	status: string;
	deadLine: string;
	dueCount: number;
	currentCount: number;
	createdAt: string;
	updatedAt: string;
	memberId?: number;
}

export interface UserSurveyResponse {
	infoList: UserSurvey[];
}

export const getUserSurveys = async (): Promise<UserSurveyResponse> => {
	return apiCall<UserSurveyResponse>({
		method: "GET",
		url: "/v1/survey-management/surveys",
	});
};

// 사용자가 관리할 설문 상세 조회
export const getSurveyAnswerDetail = async (
	surveyId: number,
): Promise<SurveyAnswerDetailResult> => {
	return apiCall<SurveyAnswerDetailResult>({
		method: "GET",
		url: "/v1/survey-management/surveys/answers",
		params: { surveyId },
	});
};
