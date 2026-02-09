import { useUserSurveys } from "../hooks/useUserSurveys";
import { ActiveTab } from "./ActiveTab";
import { AllTab } from "./AllTab";
import { ClosedTab } from "./ClosedTab";
import { DraftTab } from "./DraftTab";

interface SurveyTabContentProps {
	selectedTab: number;
}

export const SurveyTabContent = ({ selectedTab }: SurveyTabContentProps) => {
	const { draftSurveys, activeSurveys, closedSurveys } = useUserSurveys();

	return (
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
	);
};
