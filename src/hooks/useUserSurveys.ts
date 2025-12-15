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
		const now = new Date();

		const draftStatuses = new Set(["DRAFT", "WRITING"]);
		const drafts: DraftSurvey[] = userSurveys
			.filter((survey) => draftStatuses.has(survey.status))
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
			}));

		const activeStatuses = new Set(["ACTIVE", "ONGOING"]);
		const active: ActiveSurvey[] = userSurveys
			.filter((survey): survey is typeof survey & { deadLine: string } => {
				if (!survey.deadLine) return false;
				const deadline = new Date(survey.deadLine);
				return activeStatuses.has(survey.status) && deadline > now;
			})
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
				deadline: survey.deadLine,
				progress: survey.currentCount ?? 0,
				total: survey.dueCount ?? 0,
			}));

		const closed: ClosedSurvey[] = userSurveys
			.filter((survey): survey is typeof survey & { deadLine: string } => {
				if (!survey.deadLine) return false;
				if (draftStatuses.has(survey.status)) return false;
				const deadline = new Date(survey.deadLine);
				return deadline <= now;
			})
			.map((survey) => ({
				id: survey.surveyId,
				title: survey.title,
				description: survey.description,
				closedAt: survey.deadLine,
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
