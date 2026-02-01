import { SurveyCard } from "./SurveyCard";
import type { ClosedSurvey } from "./types";

interface ClosedTabProps {
	surveys: ClosedSurvey[];
}

export const ClosedTab = ({ surveys }: ClosedTabProps) => {
	if (surveys.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard key={survey.id} survey={survey} type="closed" />
			))}
		</div>
	);
};
