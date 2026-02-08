import type { SurveyListItem } from "@shared/types/surveyList";
import { useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export interface SurveyLocationState {
	survey?: SurveyListItem;
	surveyId?: string;
	source?: "main" | "quiz" | "after_complete";
	quiz_id?: number;
}

export const useSurveyRouteParams = () => {
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const locationState = location.state as SurveyLocationState | undefined;
	const surveyFromState = locationState?.survey ?? null;
	const surveyId =
		searchParams.get("surveyId") ??
		locationState?.surveyId ??
		locationState?.survey?.id ??
		null;
	const numericSurveyId = useMemo(() => {
		if (!surveyId) return null;
		const parsed = Number(surveyId);
		return Number.isNaN(parsed) ? null : parsed;
	}, [surveyId]);

	return {
		surveyId,
		numericSurveyId,
		surveyFromState,
		locationState,
	};
};
