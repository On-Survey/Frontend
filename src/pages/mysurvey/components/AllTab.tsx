import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { SurveyCard } from "./SurveyCard";
import type { ActiveSurvey, ClosedSurvey, DraftSurvey } from "./types";

interface AllTabProps {
	draftSurveys: DraftSurvey[];
	activeSurveys: ActiveSurvey[];
	closedSurveys: ClosedSurvey[];
	activeLoading?: boolean;
	activeError?: string | null;
}

export const AllTab = ({
	draftSurveys,
	activeSurveys,
	closedSurveys,
	activeLoading = false,
	activeError,
}: AllTabProps) => {
	return (
		<div className="space-y-4">
			{/* 작성중 */}
			{draftSurveys.map((survey) => (
				<SurveyCard key={`draft-${survey.id}`} survey={survey} type="draft" />
			))}
			{/* 노출중 */}
			{activeLoading ? (
				<Text color={colors.grey700} typography="t7">
					노출 중인 설문을 불러오는 중입니다.
				</Text>
			) : activeError ? (
				<Text color={colors.red500} typography="t7">
					노출 중인 설문을 가져오지 못했습니다.
				</Text>
			) : activeSurveys.length === 0 ? (
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
			{closedSurveys.map((survey) => (
				<SurveyCard key={`closed-${survey.id}`} survey={survey} type="closed" />
			))}
		</div>
	);
};
