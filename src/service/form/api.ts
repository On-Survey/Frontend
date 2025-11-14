import type { QuestionInfo } from "../../types/survey";
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
	const { data } = await api.post<
		CreateSurveyResponse,
		{ title: string; description: string }
	>("/v1/survey-form/surveys", {
		title,
		description,
	});

	return data;
};

export const createSurveyQuestion = async (
	questionInfo: QuestionInfo,
): Promise<CreateSurveyQuestionResponse> => {
	const { data } = await api.post<
		CreateSurveyQuestionResponse,
		QuestionInfo["info"]
	>(
		`/v1/survey-form/surveys/${questionInfo.surveyId}/questions`,
		questionInfo.info,
	);
	return data;
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
	const { data } = await api.post<
		CreateScreeningsResponse,
		{ content: string; answer: boolean }
	>(`/v1/survey-form/surveys/${surveyId}/screenings`, { content, answer });
	return data;
};

export const createForm = async ({
	surveyId,
}: {
	surveyId: number;
}): Promise<CreateFormResponse> => {
	const { data } = await api.patch<CreateFormResponse, { surveyId: number }>(
		`/v1/survey-form/surveys/${surveyId}`,
		{ surveyId },
	);
	return data;
};

export const saveAsDraft = async (
	questionInfo: QuestionInfo,
): Promise<CreateSurveyQuestionResponse> => {
	const { data } = await api.put<
		CreateSurveyQuestionResponse,
		QuestionInfo["info"]
	>(
		`/v1/survey-form/surveys/${questionInfo.surveyId}/questions`,
		questionInfo.info,
	);
	return data;
};
