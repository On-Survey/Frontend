import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { SurveyCard } from "./SurveyCard";
import type { ClosedSurvey } from "./types";

interface ClosedTabProps {
	surveys: ClosedSurvey[];
}

export const ClosedTab = ({ surveys }: ClosedTabProps) => {
	if (surveys.length === 0) {
		return (
			<Text color={colors.grey700} typography="t7">
				마감된 설문이 없습니다.
			</Text>
		);
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard key={survey.id} survey={survey} type="closed" />
			))}
		</div>
	);
};
