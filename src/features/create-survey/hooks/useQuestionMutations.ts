import { useMutation } from "@tanstack/react-query";

import {
	createScreenings,
	createSurveyInterests,
	createSurveyQuestion,
	saveQuestions,
} from "../service/form/api";
import type {
	CreateScreeningsResponse,
	CreateSurveyInterestsResponse,
	CreateSurveyQuestionResponse,
	createSurveyQuestionRequest,
	Interest,
	ServerQuestion,
} from "../service/form/types";

/**
 * 설문 질문 생성 mutation
 */
export const useCreateSurveyQuestion = () => {
	return useMutation<
		CreateSurveyQuestionResponse,
		Error,
		{ questionInfo: createSurveyQuestionRequest; surveyId: number }
	>({
		mutationFn: ({ questionInfo, surveyId }) =>
			createSurveyQuestion({ questionInfo, surveyId }),
	});
};

/**
 * 스크리닝 생성 mutation
 */
export const useCreateScreenings = () => {
	return useMutation<
		CreateScreeningsResponse,
		Error,
		{ surveyId: number; content: string; answer: boolean }
	>({
		mutationFn: ({ surveyId, content, answer }) =>
			createScreenings({ surveyId, content, answer }),
	});
};

/**
 * 질문들 저장 mutation
 */
export const useSaveQuestions = () => {
	return useMutation<
		CreateSurveyQuestionResponse,
		Error,
		{ surveyId: number; questions: { questions: ServerQuestion[] } }
	>({
		mutationFn: ({ surveyId, questions }) =>
			saveQuestions({ surveyId, questions }),
	});
};

/**
 * 설문 관심사 생성 mutation
 */
export const useCreateSurveyInterests = () => {
	return useMutation<
		CreateSurveyInterestsResponse,
		Error,
		{ surveyId: number; interests: Interest[] }
	>({
		mutationFn: ({ surveyId, interests }) =>
			createSurveyInterests({ surveyId, interests }),
	});
};
