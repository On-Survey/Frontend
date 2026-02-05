import { apiCall } from "@shared/api/axios/apiClient";
import type {
	OngoingSurveyResult,
	ScreeningQuestionResult,
	SubmitSurveyResponsePayload,
	SurveyAnswerDetailResult,
	SurveyDetailResult,
	WritingSurveyResult,
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
	deadLine: string | null;
	dueCount: number | null;
	currentCount: number | null;
	createdAt: string;
	updatedAt: string;
	memberId?: number;
	isFree?: boolean;
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
export interface SurveyAnswerDetailFilters {
	ages?: string[];
	genders?: string[];
	residences?: string[];
}

export const getSurveyAnswerDetail = async (
	surveyId: number,
	filters?: SurveyAnswerDetailFilters,
): Promise<SurveyAnswerDetailResult> => {
	const params: Record<string, string | string[] | number> = { surveyId };

	if (filters?.ages && filters.ages.length > 0) {
		params.ages = filters.ages;
	}
	if (filters?.genders && filters.genders.length > 0) {
		params.genders = filters.genders;
	}
	if (filters?.residences && filters.residences.length > 0) {
		params.residences = filters.residences;
	}

	return apiCall<SurveyAnswerDetailResult>({
		method: "GET",
		url: "/v1/survey-management/surveys/answers",
		params,
	});
};

// 작성 중인 설문 조회
export const getWritingSurvey = async (
	surveyId: number,
): Promise<WritingSurveyResult> => {
	return apiCall<WritingSurveyResult>({
		method: "GET",
		url: "/v1/survey-management/writing",
		params: { surveyId },
	});
};

// 설문 응답 결과 CSV 다운로드
export const downloadSurveyAnswerCsv = async (
	surveyId: number,
): Promise<{ blob: Blob; filename: string }> => {
	const { apiClient } = await import("@shared/api/axios/apiClient");

	const response = await apiClient.get(`/v1/surveys/${surveyId}/export`, {
		responseType: "blob",
	});

	const blob = response.data;

	// 응답 헤더에서 파일명 추출
	const contentDisposition = response.headers["content-disposition"];
	let filename = "survey-results.csv";

	if (contentDisposition) {
		const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;,\s]+)/);
		if (utf8Match?.[1]) {
			try {
				filename = decodeURIComponent(utf8Match[1].trim());
			} catch {
				filename = utf8Match[1].trim();
			}
		} else {
			const quotedMatch = contentDisposition.match(/filename="([^"]+)"/);
			if (quotedMatch?.[1]) {
				let extracted = quotedMatch[1];

				if (extracted.startsWith("=?UTF-8?Q?") && extracted.endsWith("?=")) {
					extracted = extracted
						.replace(/^=\?UTF-8\?Q\?/, "")
						.replace(/\?=$/, "")
						.replace(/_/g, " ")
						.replace(/=([0-9A-F]{2})/gi, (_: string, hex: string) =>
							String.fromCharCode(parseInt(hex, 16)),
						);
				}
				filename = extracted;
			} else {
				const unquotedMatch = contentDisposition.match(/filename=([^;,\s]+)/);
				if (unquotedMatch?.[1]) {
					filename = unquotedMatch[1].trim();
				}
			}
		}
	}

	return { blob, filename };
};
