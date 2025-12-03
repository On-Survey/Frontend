import { useEffect, useState } from "react";
import type {
	ActiveSurvey,
	ClosedSurvey,
	DraftSurvey,
} from "../pages/mysurvey/components/types";
import { getUserSurveys } from "../service/mysurvey/api";

/**
 * 사용자 설문 목록 조회 및 로딩 상태 관리 커스텀 훅
 */
export const useUserSurveys = () => {
	const [draftSurveys, setDraftSurveys] = useState<DraftSurvey[]>([]);
	const [activeSurveys, setActiveSurveys] = useState<ActiveSurvey[]>([]);
	const [closedSurveys, setClosedSurveys] = useState<ClosedSurvey[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserSurveys = async () => {
			setIsLoading(true);
			try {
				const resultObj = await getUserSurveys();
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

				setDraftSurveys(drafts);
				setActiveSurveys(active);
				setClosedSurveys(closed);
			} catch (error) {
				console.error("사용자 설문 조회 실패:", error);
				setDraftSurveys([]);
				setActiveSurveys([]);
				setClosedSurveys([]);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchUserSurveys();
	}, []);

	return {
		draftSurveys,
		activeSurveys,
		closedSurveys,
		isLoading,
	};
};
