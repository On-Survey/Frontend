import { partner, tdsEvent } from "@apps-in-toss/web-framework";
import { Button } from "@toss/tds-mobile";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import { SurveyTabNavigation } from "../../components/SurveyTabNavigation";
import { getOngoingSurveys } from "../../service/mysurvey";
import { ActiveTab, AllTab, ClosedTab, DraftTab } from "./components";
import type { ActiveSurvey } from "./components/types";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0); // 0: 전체, 1: 작성중, 2: 노출중, 3: 마감
	const [activeSurveys, setActiveSurveys] = useState<ActiveSurvey[]>([]);
	const [isActiveLoading, setIsActiveLoading] = useState(false);
	const [activeError, setActiveError] = useState<string | null>(null);

	useEffect(() => {
		partner.addAccessoryButton({
			id: "heart",
			title: "하트",
			icon: {
				name: "icon-heart-mono",
			},
		});

		const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
			onEvent: ({ id }) => {
				if (id === "heart") {
					navigate("/estimate");
				}
			},
		});

		return cleanup;
	}, [navigate]);

	useEffect(() => {
		const fetchOngoingSurveys = async () => {
			setIsActiveLoading(true);
			setActiveError(null);

			try {
				const result = await getOngoingSurveys();
				console.log("노출 중 설문 조회 결과:", result);
				const combined = [...result.recommended, ...result.impending].map(
					(survey) => ({
						id: survey.surveyId,
						title: survey.title,
						description: survey.description,
						memberId: survey.memberId,
					}),
				);

				setActiveSurveys(combined);
			} catch (error) {
				console.error("노출 중 설문 조회 실패:", error);
				if (axios.isAxiosError(error)) {
					console.log(
						"응답 상태 코드:",
						error.response?.status,
						"응답 데이터:",
						error.response?.data,
					);
				}
				setActiveError("노출 중인 설문을 가져오는 중 오류가 발생했습니다.");
			} finally {
				setIsActiveLoading(false);
			}
		};

		void fetchOngoingSurveys();
	}, []);

	const handleAddSurvey = () => {
		navigate("/createForm");
	};

	const handleMyPage = () => {
		navigate("/mypage");
	};

	const draftSurveys = [{ id: 1, title: "영화 시청 경험에 관한 설문" }];
	const closedSurveys = [{ id: 1, title: "고양이 야옹 시청 경험에 관한 설문" }];

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<SurveyTabNavigation
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
			/>
			<div className="h-4" />

			{/* 내용 영역 */}
			<div className="flex-1 px-4 pb-24 overflow-y-auto">
				{selectedTab === 0 && (
					<AllTab
						draftSurveys={draftSurveys}
						activeSurveys={activeSurveys}
						closedSurveys={closedSurveys}
						activeLoading={isActiveLoading}
						activeError={activeError}
					/>
				)}
				{selectedTab === 1 && <DraftTab surveys={draftSurveys} />}
				{selectedTab === 2 && (
					<ActiveTab
						surveys={activeSurveys}
						isLoading={isActiveLoading}
						error={activeError}
					/>
				)}
				{selectedTab === 3 && <ClosedTab surveys={closedSurveys} />}
			</div>

			{/* 설문 추가하기 버튼 */}
			<div className="fixed bottom-25 right-4">
				<Button size="medium" onClick={handleAddSurvey}>
					설문 추가하기
				</Button>
			</div>

			{/* 하단 네비게이션 */}
			<BottomNavigation currentPage="mysurvey" onMyPageClick={handleMyPage} />
		</div>
	);
};
