import { partner, tdsEvent } from "@apps-in-toss/web-framework";
import { Button } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation } from "../../components/BottomNavigation";
import { SurveyTabNavigation } from "../../components/SurveyTabNavigation";
import { getUserSurveys } from "../../service/mysurvey/api";
import { ActiveTab, AllTab, ClosedTab, DraftTab } from "./components";
import type {
	ActiveSurvey,
	ClosedSurvey,
	DraftSurvey,
} from "./components/types";
export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0); // 0: 전체, 1: 작성중, 2: 노출중, 3: 마감
	const [draftSurveys, setDraftSurveys] = useState<DraftSurvey[]>([]);
	const [activeSurveys, setActiveSurveys] = useState<ActiveSurvey[]>([]);
	const [closedSurveys, setClosedSurveys] = useState<ClosedSurvey[]>([]);

	// 상단 액세서리 버튼 등록
	useEffect(() => {
		partner.addAccessoryButton({
			id: "heart",
			title: "하트",
			icon: { name: "icon-heart-mono" },
		});

		const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
			onEvent: ({ id }) => {
				if (id === "heart") navigate("/estimate");
			},
		});

		return cleanup;
	}, [navigate]);

	// 사용자가 생성한 설문 조회
	useEffect(() => {
		const fetchUserSurveys = async () => {
			try {
				const resultObj = await getUserSurveys();
				const userSurveys = resultObj.infoList;

				const now = new Date();

				// 작성 중 (백엔드에 따라 DRAFT 또는 WRITING 사용)
				const draftStatuses = new Set(["DRAFT", "WRITING"]);
				let drafts: DraftSurvey[] = userSurveys
					.filter((survey) => draftStatuses.has(survey.status))
					.map((survey) => ({
						id: survey.surveyId,
						title: survey.title,
						description: survey.description,
					}));

				// 노출 중
				const activeStatuses = new Set(["ACTIVE", "ONGOING"]);
				let active: ActiveSurvey[] = userSurveys
					.filter((survey) => {
						if (!survey.deadLine) return false;
						const deadline = new Date(survey.deadLine);
						return activeStatuses.has(survey.status) && deadline > now;
					})
					.map((survey) => ({
						id: survey.surveyId,
						title: survey.title,
						description: survey.description,
						deadline: survey.deadLine,
						progress: survey.currentCount,
						total: survey.dueCount,
					}));

				// 마감: 마감일이 있고, 이미 지난 설문만 (작성중/DRAFT는 제외)
				let closed: ClosedSurvey[] = userSurveys
					.filter((survey) => {
						if (!survey.deadLine) return false;
						// 작성 중인 설문은 마감 리스트에서 제외
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

				// API에서 아무것도 안 오면 더미 카드 하나씩 노출
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
			}
		};

		void fetchUserSurveys();
	}, []);

	const handleAddSurvey = () => navigate("/createForm");
	const handleMyPage = () => navigate("/mypage");

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<SurveyTabNavigation
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
			/>
			<div className="h-4" />

			<div className="flex-1 px-4 pb-24 overflow-y-auto">
				{selectedTab === 0 && (
					<AllTab
						draftSurveys={draftSurveys}
						activeSurveys={activeSurveys}
						closedSurveys={closedSurveys}
					/>
				)}
				{selectedTab === 1 && <DraftTab surveys={draftSurveys} />}
				{selectedTab === 2 && <ActiveTab surveys={activeSurveys} />}
				{selectedTab === 3 && <ClosedTab surveys={closedSurveys} />}
			</div>

			<div className="fixed bottom-25 right-4">
				<Button size="medium" onClick={handleAddSurvey}>
					설문 추가하기
				</Button>
			</div>

			<BottomNavigation currentPage="mysurvey" onMyPageClick={handleMyPage} />
		</div>
	);
};
