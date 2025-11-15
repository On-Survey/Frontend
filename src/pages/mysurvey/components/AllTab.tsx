import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
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
			{draftSurveys.length === 0 ? (
				<Text color={colors.grey700} typography="t7">
					작성 중인 설문이 없습니다.
				</Text>
			) : (
				draftSurveys.map((survey) => (
					<SurveyCard key={`draft-${survey.id}`} survey={survey} type="draft" />
				))
			)}
			{/* 노출중 */}
			{activeSurveys.length === 0 ? (
				<Text color={colors.grey700} typography="t7">
					노출 중인 설문이 없습니다.
				</Text>
			) : (
				activeSurveys.map((survey) => (
					<SurveyCard
						key={`active-${survey.id}`}
						survey={survey}
						type="active"
					/>
				))
			)}
			{/* 마감 */}
			{closedSurveys.length === 0 ? (
				<Text color={colors.grey700} typography="t7">
					마감된 설문이 없습니다.
				</Text>
			) : (
				closedSurveys.map((survey) => (
					<SurveyCard
						key={`closed-${survey.id}`}
						survey={survey}
						type="closed"
					/>
				))
			)}
		</div>
	);
};
