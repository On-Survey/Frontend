import { SurveyCard } from "./SurveyCard";
import type { DraftSurvey } from "./types";

interface DraftTabProps {
	surveys: DraftSurvey[];
}

export const DraftTab = ({ surveys }: DraftTabProps) => {
	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard key={survey.id} survey={survey} type="draft" />
			))}
		</div>
	);
};
