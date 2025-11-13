import type { QuestionInfo } from "../../types/survey";
import { getAccessToken } from "../../utils/tokenManager";
import { api } from "../axios";
import type {
	CreateFormResponse,
	CreateScreeningsResponse,
	CreateSurveyQuestionResponse,
	CreateSurveyResponse,
} from "./types";

export const createSurvey = async ({
	title,
	description,
}: {
	title: string;
	description: string;
}): Promise<CreateSurveyResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreateSurveyResponse,
		{ title: string; description: string }
	>(
		"/v1/survey-form/surveys",
		{
			title,
			description,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return data.data;
};

export const createSurveyQuestion = async (
	questionInfo: QuestionInfo,
): Promise<CreateSurveyQuestionResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreateSurveyQuestionResponse,
		QuestionInfo["info"]
	>(
		`/v1/survey-form/surveys/${questionInfo.surveyId}/questions`,
		questionInfo.info,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return data.data;
};

export const createScreenings = async ({
	surveyId,
	content,
	answer,
}: {
	surveyId: number;
	content: string;
	answer: boolean;
}): Promise<CreateScreeningsResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreateScreeningsResponse,
		{ content: string; answer: boolean }
	>(
		`/v1/survey-form/surveys/${surveyId}/screenings`,
		{ content, answer },
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return data.data;
};

export const createForm = async ({
	surveyId,
}: {
	surveyId: number;
}): Promise<CreateFormResponse> => {
	const token = await getAccessToken();
	const { data } = await api.patch<CreateFormResponse, { surveyId: number }>(
		`/v1/survey-form/surveys/${surveyId}`,
		{ surveyId },
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return data.data;
};

export const saveAsDraft = async (
	questionInfo: QuestionInfo,
): Promise<CreateSurveyQuestionResponse> => {
	const token = await getAccessToken();
	const { data } = await api.put<
		CreateSurveyQuestionResponse,
		QuestionInfo["info"]
	>(
		`/v1/survey-form/surveys/${questionInfo.surveyId}/questions`,
		questionInfo.info,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return data.data;
};
