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
				let drafts: DraftSurvey[] = userSurveys
					.filter((survey) => draftStatuses.has(survey.status))
					.map((survey) => ({
						id: survey.surveyId,
						title: survey.title,
						description: survey.description,
					}));

				const activeStatuses = new Set(["ACTIVE", "ONGOING"]);
				let active: ActiveSurvey[] = userSurveys
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

				let closed: ClosedSurvey[] = userSurveys
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
				if (drafts.length === 0) {
					drafts = [
						{
							id: -1,
							title: "작성중 더미 설문",
							description: "작성 중인 설문이 없을 때 표시되는 더미입니다.",
						},
					];
				}
				if (active.length === 0) {
					active = [
						{
							id: -2,
							title: "노출중 더미 설문",
							description: "노출 중인 설문이 없을 때 표시되는 더미입니다.",
							deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
								.toISOString()
								.slice(0, 16)
								.replace("T", " "),
							progress: 0,
							total: 100,
						},
					];
				}
				if (closed.length === 0) {
					closed = [
						{
							id: -3,
							title: "마감 더미 설문",
							description: "마감된 설문이 없을 때 표시되는 더미입니다.",
							closedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
						},
					];
				}

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
