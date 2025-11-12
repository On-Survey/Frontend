import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { SurveyCard } from "./SurveyCard";
import type { ActiveSurvey } from "./types";

interface ActiveTabProps {
	surveys: ActiveSurvey[];
	isLoading?: boolean;
	error?: string | null;
}

export const ActiveTab = ({
	surveys,
	isLoading = false,
	error,
}: ActiveTabProps) => {
	if (isLoading) {
		return (
			<Text color={colors.grey700} typography="t7">
				노출 중인 설문을 불러오는 중입니다.
			</Text>
		);
	}

	if (error) {
		return (
			<Text color={colors.red500} typography="t7">
				노출 중인 설문을 가져오지 못했습니다.
			</Text>
		);
	}

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
