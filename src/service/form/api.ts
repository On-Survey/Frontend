import type { QuestionInfo } from "../../types/survey";
import { api } from "../axios";
import type {
	CreateFormRequest,
	CreateFormResponse,
	CreateScreeningsResponse,
	CreateSurveyInterestsResponse,
	CreateSurveyQuestionResponse,
	CreateSurveyResponse,
	createSurveyQuestionRequest,
	Interest,
	ServerQuestionRequest,
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

export const createSurveyQuestion = async ({
	questionInfo,
	surveyId,
}: {
	questionInfo: createSurveyQuestionRequest;
	surveyId: number;
}): Promise<CreateSurveyQuestionResponse> => {
	const { data } = await api.post<
		CreateSurveyQuestionResponse,
		{ questions: createSurveyQuestionRequest[] }
	>(`/v1/survey-form/surveys/${surveyId}/questions`, {
		questions: [questionInfo],
	});
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
	...formPayload
}: CreateFormRequest & { surveyId: number }): Promise<CreateFormResponse> => {
	const { data } = await api.patch<CreateFormResponse, CreateFormRequest>(
		`/v1/survey-form/surveys/${surveyId}`,
		formPayload,
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

/**
 * 질문들을 서버 형식으로 변환하여 저장
 */
export const saveQuestions = async ({
	surveyId,
	questions,
}: {
	surveyId: number;
	questions: ServerQuestionRequest;
}): Promise<CreateSurveyQuestionResponse> => {
	const { data } = await api.put<
		CreateSurveyQuestionResponse,
		ServerQuestionRequest
	>(`/v1/survey-form/surveys/${surveyId}/questions`, questions);
	console.log("data", data);
	return data;
};

export const createSurveyInterests = async ({
	surveyId,
	interests,
}: {
	surveyId: number;
	interests: Interest[];
}): Promise<CreateSurveyInterestsResponse> => {
	const { data } = await api.patch<
		CreateSurveyInterestsResponse,
		{ interests: Interest[] }
	>(`/v1/survey-form/surveys/${surveyId}/interests`, { interests: interests });
	return data;
};
