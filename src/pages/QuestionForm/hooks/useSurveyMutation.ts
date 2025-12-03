import { useMutation } from "@tanstack/react-query";
import { createForm, createSurvey, patchSurvey } from "../api/api";
import type {
	CreateFormRequest,
	CreateFormResponse,
	CreateSurveyResponse,
	PatchSurveyRequest,
	PatchSurveyResponse,
} from "../api/types";

/**
 * 설문 생성 mutation
 */
export const useCreateSurvey = () => {
	return useMutation<
		CreateSurveyResponse,
		Error,
		{ title: string; description: string }
	>({
		mutationFn: ({ title, description }) =>
			createSurvey({ title, description }),
	});
};

/**
 * 폼 생성 mutation
 */
export const useCreateForm = () => {
	return useMutation<
		CreateFormResponse,
		Error,
		CreateFormRequest & { surveyId: number }
	>({
		mutationFn: ({ surveyId, ...formPayload }) =>
			createForm({ surveyId, ...formPayload }),
	});
};

/**
 * 설문 수정 mutation
 */
export const usePatchSurvey = () => {
	return useMutation<PatchSurveyResponse, Error, PatchSurveyRequest>({
		mutationFn: ({ surveyId, title, description }) =>
			patchSurvey({ surveyId, title, description }),
	});
};
