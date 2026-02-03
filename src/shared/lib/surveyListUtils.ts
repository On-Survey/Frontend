import type { OngoingSurveySummary } from "../../features/survey-list/service/surveyList/types";

// 설문 중복 제거
export const getUniqueSurveyIdsFromArrays = (
	...surveyArrays: (OngoingSurveySummary[] | undefined)[]
): Set<number> => {
	const allSurveys = surveyArrays.flatMap((surveys) => surveys ?? []);
	return new Set(allSurveys.map((survey) => survey.surveyId));
};
