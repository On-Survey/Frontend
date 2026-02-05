import { useMutation } from "@tanstack/react-query";
import {
	createForm,
	createFreeForm,
	createSurvey,
	patchSurvey,
} from "../service/form/api";
import type {
	CreateFormRequest,
	CreateFormResponse,
	CreateFreeFormRequest,
	CreateSurveyResponse,
	PatchSurveyRequest,
	PatchSurveyResponse,
} from "../service/form/types";

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
 * 무료 폼 생성 mutation
 */
export const useCreateFreeForm = () => {
	return useMutation<
		CreateFormResponse,
		Error,
		CreateFreeFormRequest & { surveyId: number }
	>({
		mutationFn: ({ surveyId, ...formPayload }) =>
			createFreeForm({ surveyId, ...formPayload }),
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
