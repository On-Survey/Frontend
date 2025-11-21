import { colors } from "@toss/tds-colors";
import { Button, Text } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation } from "../../components/BottomNavigation";
import { SurveyTabNavigation } from "../../components/SurveyTabNavigation";
import { useUserSurveys } from "../../hooks/useUserSurveys";
import { ActiveTab, AllTab, ClosedTab, DraftTab } from "./components";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const { draftSurveys, activeSurveys, closedSurveys, isLoading } =
		useUserSurveys();

	const handleAddSurvey = () => navigate("/createFormStart");
	const handleMyPage = () => navigate("/mypage");

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<SurveyTabNavigation
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
			/>
			<div className="h-4" />

			<div className="flex-1 px-4 pb-24 overflow-y-auto">
				{isLoading ? (
					<div className="flex items-center justify-center h-full min-h-[400px]">
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
							<Text color={colors.grey600} typography="t6" fontWeight="medium">
								불러오는 중입니다
							</Text>
						</div>
					</div>
				) : (
					<>
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
					</>
				)}
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
