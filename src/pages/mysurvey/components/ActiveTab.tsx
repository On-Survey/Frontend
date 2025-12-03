import { SurveyCard } from "./SurveyCard";
import type { ActiveSurvey } from "./types";

interface ActiveTabProps {
	surveys: ActiveSurvey[];
}

export const ActiveTab = ({ surveys }: ActiveTabProps) => {
	if (surveys.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard key={survey.id} survey={survey} type="active" />
			))}
		</div>
	);
};
