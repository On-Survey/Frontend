import { Button } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import { SurveyTabNavigation } from "../../components/SurveyTabNavigation";
import { ActiveTab, AllTab, ClosedTab, DraftTab } from "./components";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0); // 0: 전체, 1: 작성중, 2: 노출중, 3: 마감

	const handleAddSurvey = () => {
		navigate("/createForm");
	};

	// Mock
	const draftSurveys = [{ id: 1, title: "영화 시청 경험에 관한 설문" }];
	const activeSurveys = [
		{
			id: 1,
			title: "영화 시청 경험에 관한 설문",
			progress: 56,
			total: 70,
			deadline: "10월 26일까지",
		},
	];
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
					/>
				)}
				{selectedTab === 1 && <DraftTab surveys={draftSurveys} />}
				{selectedTab === 2 && <ActiveTab surveys={activeSurveys} />}
				{selectedTab === 3 && <ClosedTab surveys={closedSurveys} />}
			</div>

			{/* 설문 추가하기 버튼 */}
			<div className="fixed bottom-25 right-4">
				<Button size="medium" onClick={handleAddSurvey}>
					설문 추가하기
				</Button>
			</div>

			{/* 하단 네비게이션 */}
			<BottomNavigation currentPage="mysurvey" />
		</div>
	);
};
