import { useInfiniteQuery } from "@tanstack/react-query";
import {
	getImpendingSurveys,
	type ImpendingSurveyResult,
} from "../../../service/surveyList";

type PageParam = {
	lastSurveyId: number;
	lastDeadline?: string;
};

export const useImpendingSurveys = (enabled = true) => {
	return useInfiniteQuery({
		queryKey: ["impendingSurveys"],
		queryFn: ({ pageParam = { lastSurveyId: 0 } }: { pageParam?: PageParam }) =>
			getImpendingSurveys({
				lastSurveyId: pageParam.lastSurveyId,
				lastDeadline: pageParam.lastDeadline,
				size: 15,
			}),
		getNextPageParam: (lastPage: ImpendingSurveyResult) => {
			const hasNext = lastPage.hasNext ?? lastPage.impendingHasNext ?? false;
			if (!hasNext) return undefined;

			const surveys = lastPage.data ?? lastPage.impending ?? [];
			if (surveys.length === 0) return undefined;

			const lastSurvey = surveys[surveys.length - 1];
			return {
				lastSurveyId: lastSurvey.surveyId,
				lastDeadline: lastSurvey.deadline,
			};
		},
		initialPageParam: { lastSurveyId: 0 } as PageParam,
		enabled,
	});
};
