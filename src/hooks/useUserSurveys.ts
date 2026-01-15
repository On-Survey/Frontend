import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type {
	ActiveSurvey,
	ClosedSurvey,
	DraftSurvey,
} from "../pages/mysurvey/components/types";
import { getUserSurveys } from "../service/mysurvey/api";

export const useUserSurveys = () => {
	const {
		data: resultObj,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["userSurveys"],
		queryFn: getUserSurveys,
	});

	const { draftSurveys, activeSurveys, closedSurveys } = useMemo(() => {
		const userSurveys = resultObj?.infoList ?? [];

		const draftStatuses = new Set(["DRAFT", "WRITING"]);
		const drafts: DraftSurvey[] = userSurveys
			.filter((survey) => draftStatuses.has(survey.status))
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
			}));

		const activeStatuses = new Set(["ONGOING", "ACTIVE"]);
		const active: ActiveSurvey[] = userSurveys
			.filter((survey) => activeStatuses.has(survey.status))
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
				deadline: survey.deadLine ?? undefined,
				progress: survey.currentCount ?? 0,
				total: survey.dueCount ?? 0,
			}));

		const closed: ClosedSurvey[] = userSurveys
			.filter((survey) => survey.status === "CLOSED")
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
				closedAt: survey.deadLine ?? undefined,
			}));

		return {
			draftSurveys: drafts,
			activeSurveys: active,
			closedSurveys: closed,
		};
	}, [resultObj]);

	if (error) {
		console.error("사용자 설문 조회 실패:", error);
	}

	return {
		draftSurveys,
		activeSurveys,
		closedSurveys,
		isLoading,
	};
};
