import { BottomNavigation } from "@shared/components/BottomNavigation";
import { SurveyTabNavigation } from "@shared/components/SurveyTabNavigation";
import { Button } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveTab, AllTab, ClosedTab, DraftTab } from "../components";
import { useUserSurveys } from "../hooks/useUserSurveys";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const { draftSurveys, activeSurveys, closedSurveys } = useUserSurveys();

	const handleAddSurvey = () =>
		navigate("/createFormStart", { state: { source: "mysurvey_button" } });
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
				<Button
					size="medium"
					onClick={handleAddSurvey}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					설문 추가하기
				</Button>
			</div>

			<BottomNavigation currentPage="mysurvey" onMyPageClick={handleMyPage} />
		</div>
	);
};
