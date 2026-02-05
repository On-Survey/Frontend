import {
	getRecommendedSurveys,
	type RecommendedSurveyResult,
} from "@features/survey-list/service/surveyList";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useRecommendedSurveys = (enabled = true) => {
	return useInfiniteQuery<RecommendedSurveyResult>({
		queryKey: ["recommendedSurveys"],
		queryFn: ({ pageParam = 0 }) =>
			getRecommendedSurveys({ lastSurveyId: pageParam as number, size: 15 }),
		getNextPageParam: (lastPage) => {
			const hasNext = lastPage.hasNext ?? lastPage.recommendedHasNext ?? false;
			if (!hasNext) return undefined;

			const surveys = lastPage.data ?? lastPage.recommended ?? [];
			if (surveys.length === 0) return undefined;

			const lastSurvey = surveys[surveys.length - 1];
			return lastSurvey.surveyId;
		},
		initialPageParam: 0,
		enabled,
	});
};
