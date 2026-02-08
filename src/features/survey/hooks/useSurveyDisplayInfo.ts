import { topics } from "@shared/constants/topics";
import type { SurveyListItem } from "@shared/types/surveyList";
import { useMemo } from "react";

interface SurveyInfo {
	title: string;
	description: string;
	topicId?: string;
	remainingTimeText?: string;
	isClosed?: boolean;
	isFree?: boolean;
}

interface UseSurveyDisplayInfoParams {
	surveyFromState?: SurveyListItem | null;
	surveyInfo?: SurveyInfo | null;
}

export const useSurveyDisplayInfo = ({
	surveyFromState,
	surveyInfo,
}: UseSurveyDisplayInfoParams) => {
	return useMemo(() => {
		const surveyTitle = surveyFromState?.title ?? surveyInfo?.title;
		const surveyDescription =
			surveyFromState?.description ?? surveyInfo?.description;
		const topicId = surveyFromState?.topicId ?? surveyInfo?.topicId;
		const surveyTopicName = topicId
			? topics.find((topic) => topic.id === topicId)?.name
			: undefined;
		const remainingTimeText =
			surveyFromState?.remainingTimeText ?? surveyInfo?.remainingTimeText;
		const isClosed =
			surveyFromState?.isClosed ??
			surveyInfo?.isClosed ??
			remainingTimeText === "마감됨";
		const isFree = surveyFromState?.isFree ?? surveyInfo?.isFree;

		return {
			surveyTitle,
			surveyDescription,
			surveyTopicName,
			remainingTimeText,
			isClosed,
			isFree,
		};
	}, [surveyFromState, surveyInfo]);
};
