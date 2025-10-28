import { SurveyCard } from "./SurveyCard";
import type { ActiveSurvey, ClosedSurvey, DraftSurvey } from "./types";

interface AllTabProps {
	draftSurveys: DraftSurvey[];
	activeSurveys: ActiveSurvey[];
	closedSurveys: ClosedSurvey[];
}

export const AllTab = ({
	draftSurveys,
	activeSurveys,
	closedSurveys,
}: AllTabProps) => {
	return (
		<div className="space-y-4">
			{/* 작성중 */}
			{draftSurveys.map((survey) => (
				<SurveyCard key={`draft-${survey.id}`} survey={survey} type="draft" />
			))}
			{/* 노출중 */}
			{activeSurveys.map((survey) => (
				<SurveyCard key={`active-${survey.id}`} survey={survey} type="active" />
			))}
			{/* 마감 */}
			{closedSurveys.map((survey) => (
				<SurveyCard key={`closed-${survey.id}`} survey={survey} type="closed" />
			))}
		</div>
	);
};
