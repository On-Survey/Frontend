import { BottomNavigation } from "@shared/components/BottomNavigation";
import { SurveyTabNavigation } from "@shared/components/SurveyTabNavigation";
import { Button } from "@toss/tds-mobile";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyTabContent } from "../components";
import { SurveyTabLoading } from "../ui/SurveyTabLoading";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

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
			<Suspense fallback={<SurveyTabLoading />}>
				<SurveyTabContent selectedTab={selectedTab} />
			</Suspense>
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
