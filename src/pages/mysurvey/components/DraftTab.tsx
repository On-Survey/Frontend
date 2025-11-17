import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useDraftSurvey } from "../../../hooks/useDraftSurvey";
import { SurveyCard } from "./SurveyCard";
import type { DraftSurvey } from "./types";

interface DraftTabProps {
	surveys: DraftSurvey[];
}

export const DraftTab = ({ surveys }: DraftTabProps) => {
	const { handleDraftClick } = useDraftSurvey();

	if (surveys.length === 0) {
		return (
			<Text color={colors.grey700} typography="t7">
				작성 중인 설문이 없습니다.
			</Text>
		);
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard
					key={survey.id}
					survey={survey}
					type="draft"
					onClick={(id) => handleDraftClick(id, surveys)}
				/>
			))}
		</div>
	);
};
