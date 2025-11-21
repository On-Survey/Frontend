import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { SurveyCard } from "./SurveyCard";
import type { ActiveSurvey } from "./types";

interface ActiveTabProps {
	surveys: ActiveSurvey[];
}

export const ActiveTab = ({ surveys }: ActiveTabProps) => {
	if (surveys.length === 0) {
		return (
			<Text color={colors.grey700} typography="t7">
				노출 중인 설문이 없습니다.
			</Text>
		);
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard key={survey.id} survey={survey} type="active" />
			))}
		</div>
	);
};
