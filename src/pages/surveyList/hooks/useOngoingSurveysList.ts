import { useInfiniteQuery } from "@tanstack/react-query";
import {
	getOngoingSurveys,
	type OngoingSurveyResult,
} from "../../../service/surveyList";

export const useOngoingSurveysList = (enabled = true) => {
	return useInfiniteQuery<OngoingSurveyResult>({
		queryKey: ["ongoingSurveysList"],
		queryFn: ({ pageParam = 0 }) =>
			getOngoingSurveys({ lastSurveyId: pageParam as number, size: 15 }),
		getNextPageParam: (lastPage) => {
			const hasNext =
				(lastPage.recommendedHasNext ?? false) ||
				(lastPage.impendingHasNext ?? false);
			if (!hasNext) return undefined;

			const allSurveys = [
				...(lastPage.recommended ?? []),
				...(lastPage.impending ?? []),
			];
			if (allSurveys.length === 0) return undefined;

			const lastSurvey = allSurveys[allSurveys.length - 1];
			return lastSurvey.surveyId;
		},
		initialPageParam: 0,
		enabled,
	});
};
