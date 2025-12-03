import { api } from "../axios";
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

//설문에 대한 응답 생성
export const getSurveyParticipation = async (
	params: GetSurveyParticipationParams,
): Promise<{
	info: TransformedSurveyQuestion[];
	title: string;
	description: string;
	interests: string[];
	deadline: string;
}> => {
	const result = await apiCall<SurveyParticipationInfo>({
		method: "GET",
		url: "/v1/survey-participation/surveys",
		params,
	});

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

	return {
		info: transformed,
		title: result.title,
		description: result.description,
		interests: result.interests,
		deadline: result.deadline,
	};
};

//설문에 대한 응답 생성
export const submitSurveyParticipation = async (
	surveyId: number,
	infoList: SubmitSurveyParticipationPayload["infoList"],
): Promise<boolean> => {
	return apiCall<boolean>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}`,
		data: { infoList },
	});
};

//관심사에 일치하는 설문의 스크리닝 문항 조회
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

//스크리닝 문항에 대한 응답 생성
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

//설문 완료 처리
export const completeSurvey = async (surveyId: number): Promise<boolean> => {
	const { data } = await api.post<{ result: boolean }, undefined>(
		`/v1/survey-participation/surveys/${surveyId}/complete`,
	);
	return data.result ?? false;
};
