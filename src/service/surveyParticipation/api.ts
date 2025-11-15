import { apiCall } from "../axios/apiClient";
import {
	type GetScreeningsParams,
	mapBackendQuestionType,
	type ScreeningResponse,
	type SubmitScreeningResponsePayload,
	type SubmitSurveyParticipationPayload,
	type SurveyParticipationInfo,
	type TransformedSurveyQuestion,
} from "./types";

export interface GetSurveyParticipationParams {
	surveyId: number;
}

/**
 * 선택한 설문 문항을 조회합니다.
 * GET /v1/survey-participation/surveys
 */
export const getSurveyParticipation = async (
	params: GetSurveyParticipationParams,
): Promise<{ info: TransformedSurveyQuestion[] }> => {
	const result = await apiCall<SurveyParticipationInfo>({
		method: "GET",
		url: "/v1/survey-participation/surveys",
		params,
	});

	// 백엔드 응답을 프론트엔드 형식으로 변환
	const transformed = result.info.map((question) => {
		const base: TransformedSurveyQuestion = {
			questionId: question.questionId,
			surveyId: question.surveyId,
			type: mapBackendQuestionType(question.questionType),
			title: question.title,
			description: question.description,
			isRequired: question.isRequired,
			questionOrder: question.questionOrder,
		};

		// 타입별 추가 필드 추가
		if (question.questionType === "CHOICE" && "options" in question) {
			base.maxChoice = question.maxChoice;
			base.hasNoneOption = question.hasNoneOption;
			base.hasCustomInput = question.hasCustomInput;
			base.options = question.options?.map((opt, idx) => ({
				...opt,
				order: idx,
			}));
		}

		if (question.questionType === "DATE" && "date" in question) {
			base.date = question.date;
		}

		if (question.questionType === "RATING" && "minValue" in question) {
			base.minValue = question.minValue;
			base.maxValue = question.maxValue;
		}

		return base;
	});

	return { info: transformed };
};

/**
 * 설문에 대한 응답 생성
 * POST /v1/survey-participation/surveys/{surveyId}
 * Request body: { "infoList": [{ "questionId": number, "content": string }] }
 */
export const submitSurveyParticipation = async (
	surveyId: number,
	infoList: SubmitSurveyParticipationPayload["infoList"],
): Promise<void> => {
	await apiCall<null>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}`,
		data: { infoList },
	});
};

/**
 * 관심사에 일치하는 설문의 스크리닝 문항 조회
 * GET /v1/survey-participation/surveys/screenings
 * Query params: lastSurveyId (default: 0), size (default: 5)
 */
export const getScreenings = async (
	params?: GetScreeningsParams,
): Promise<ScreeningResponse> => {
	const queryParams = {
		lastSurveyId: params?.lastSurveyId ?? 0,
		size: params?.size ?? 5,
	};

	const result = await apiCall<ScreeningResponse>({
		method: "GET",
		url: "/v1/survey-participation/surveys/screenings",
		params: queryParams,
	});

	return result;
};

/**
 * 스크리닝 문항에 대한 응답 생성
 * POST /v1/survey-participation/screenings/{screeningId}
 * Request body: { "content": string }
 */
export const submitScreeningResponse = async (
	screeningId: number,
	payload: SubmitScreeningResponsePayload,
): Promise<void> => {
	await apiCall<null>({
		method: "POST",
		url: `/v1/survey-participation/screenings/${screeningId}`,
		data: payload,
	});
};
