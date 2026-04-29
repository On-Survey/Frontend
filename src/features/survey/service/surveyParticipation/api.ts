import { api } from "@shared/api/axios";
import { apiCall } from "@shared/api/axios/apiClient";
import {
	type GetScreeningsParams,
	mapBackendQuestionType,
	type ScreeningResponse,
	type SubmitScreeningResponsePayload,
	type SubmitSurveyParticipationPayload,
	type SurveyBasicInfo,
	type SurveyQuestionsInfo,
	type TransformedSurveyQuestion,
} from "./types";

export interface GetSurveyParticipationParams {
	surveyId: number;
	section?: number; // 섹션 번호 (선택 파라미터, 기본값 1)
}

// 설문 정보 조회 (responseCount 포함)
// export const getSurveyInfo = async (
// 	params: GetSurveyParticipationParams,
// ): Promise<{
// 	surveyId: number;
// 	title: string;
// 	description: string;
// 	interests: string[];
// 	deadline: string;
// 	isFree?: boolean;
// 	responseCount: number;
// }> => {
// 	const result = await apiCall<SurveyInfo>({
// 		method: "GET",
// 		url: "/v1/survey-participation/surveys/info",
// 		params,
// 	});

// 	return {
// 		surveyId: result.surveyId,
// 		title: result.title,
// 		description: result.description,
// 		interests: result.interests,
// 		deadline: result.deadline,
// 		isFree: result.isFree,
// 		responseCount: result.responseCount,
// 	};
// };

// 설문 문항 정보 조회
export const getSurveyQuestions = async (
	params: GetSurveyParticipationParams,
): Promise<{
	info: TransformedSurveyQuestion[];
	sectionTitle?: string;
	sectionDescription?: string;
	currSection?: number;
	nextSection?: number;
}> => {
	const result = await apiCall<SurveyQuestionsInfo>({
		method: "GET",
		url: "/v1/survey-participation/surveys/questions",
		params,
	});

	const transformed = result.info.map((question) => {
		const mappedType =
			question.questionType === "GRID"
				? question.isCheckbox
					? "checkboxGrid"
					: "multipleChoiceGrid"
				: mapBackendQuestionType(question.questionType);

		const base: TransformedSurveyQuestion = {
			questionId: question.questionId,
			surveyId: question.surveyId,
			type: mappedType,
			title: question.title,
			description: question.description,
			isRequired: question.isRequired,
			isChoiceDistinct: question.isChoiceDistinct,
			questionOrder: question.questionOrder,
			...(question.imageUrl != null && { imageUrl: question.imageUrl }),
		};

		// 문항 자체의 nextSection과 isSectionDecidable 필드 추가 (모든 타입에 공통)
		if ("nextSection" in question) {
			base.nextSection = question.nextSection;
		}
		if ("isSectionDecidable" in question) {
			base.isSectionDecidable = question.isSectionDecidable;
		}

		if (question.questionType === "CHOICE" && "options" in question) {
			base.maxChoice = question.maxChoice;
			base.hasNoneOption = question.hasNoneOption;
			base.hasCustomInput = question.hasCustomInput;
			base.options = question.options?.map((opt, idx) => ({
				...opt,
				order: idx,
				nextSection: opt.nextSection,
				...(opt.imageUrl != null && { imageUrl: opt.imageUrl }),
			}));
		}

		// 섹션 정보 추가
		if ("section" in question) {
			base.section = question.section;
		}

		if (question.questionType === "DATE" && "date" in question) {
			base.date = question.date;
		}

		if (question.questionType === "TIME" && "isInterval" in question) {
			base.isInterval = question.isInterval;
		}

		if (question.questionType === "RATING" && "minValue" in question) {
			base.minValue = question.minValue;
			base.maxValue = question.maxValue;
			if ("rate" in question) base.rate = question.rate;
		}

		if (question.questionType === "IMAGE" && "imageUrl" in question) {
			base.imageUrl = question.imageUrl;
		}

		if (question.questionType === "GRID" && "gridOptions" in question) {
			const sortedOptions = [...(question.gridOptions ?? [])].sort(
				(a, b) => a.order - b.order,
			);
			base.rows = sortedOptions
				.filter((option) => option.isRow)
				.map((option) => option.content);
			base.columns = sortedOptions
				.filter((option) => !option.isRow)
				.map((option) => option.content);
		}

		return base;
	});

	return {
		info: transformed,
		sectionTitle: result.sectionTitle,
		sectionDescription: result.sectionDescription,
		currSection: result.currSection,
		nextSection: result.nextSection,
	};
};

export const getSurveyQuestionsForSurveyIntro = async (
	surveyId: number,
): Promise<{
	info: TransformedSurveyQuestion[];
	sectionTitle?: string;
	sectionDescription?: string;
	currSection?: number;
	nextSection?: number;
}> => {
	const section1 = await getSurveyQuestions({ surveyId, section: 1 });
	if (section1.info.length > 0) {
		return section1;
	}

	const sectionsToTry = new Set<number>();
	if (
		section1.nextSection != null &&
		section1.nextSection > 0 &&
		section1.nextSection !== 1
	) {
		sectionsToTry.add(section1.nextSection);
	}
	for (let s = 2; s <= 30; s += 1) {
		sectionsToTry.add(s);
	}

	for (const section of sectionsToTry) {
		if (section <= 1) continue;
		const res = await getSurveyQuestions({ surveyId, section });
		if (res.info.length > 0) {
			return res;
		}
	}

	return section1;
};

// 설문 정보와 문항 정보를 함께 조회 (하위 호환성 유지)
export const getSurveyParticipation = async (
	params: GetSurveyParticipationParams,
): Promise<{
	info: TransformedSurveyQuestion[];
	title: string;
	description: string;
	interests: string[];
	deadline: string;
	isFree?: boolean;
	responseCount?: number;
}> => {
	const [surveyInfo, questionsInfo] = await Promise.all([
		getSurveyInfo(params.surveyId),
		getSurveyQuestions(params),
	]);

	return {
		info: questionsInfo.info,
		title: surveyInfo.title,
		description: surveyInfo.description,
		interests: surveyInfo.interests,
		deadline: surveyInfo.deadline,
		isFree: surveyInfo.isFree,
		responseCount: surveyInfo.responseCount,
	};
};

export const getSurveyInfo = async (
	surveyId: number,
): Promise<SurveyBasicInfo> => {
	return apiCall<SurveyBasicInfo>({
		method: "GET",
		url: "/v1/survey-participation/surveys/info",
		params: { surveyId },
	});
};

//설문에 대한 응답 생성
export const submitSurveyParticipation = async (
	surveyId: number,
	payload: SubmitSurveyParticipationPayload,
): Promise<boolean> => {
	return apiCall<boolean>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}`,
		data: payload,
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

/** 완료 시 서버가 최종 방문 경로만 반영하도록 방문 섹션 목록을 전달할 때 사용 */
export type CompleteSurveyRequestBody = {
	visitedSections?: number[];
};

//설문 완료 처리
export const completeSurvey = async (
	surveyId: number,
	body?: CompleteSurveyRequestBody,
): Promise<boolean> => {
	const url = `/v1/survey-participation/surveys/${surveyId}/complete`;
	const { data } = await api.post<
		{ result: boolean },
		CompleteSurveyRequestBody
	>(url, body);
	return data.result ?? false;
};

// 설문 heartbeat
export const sendSurveyHeartbeat = async (
	surveyId: number,
): Promise<boolean> => {
	const result = await apiCall<boolean>({
		method: "POST",
		url: `/v1/survey-participation/surveys/${surveyId}/heartbeat`,
	});
	return result;
};
