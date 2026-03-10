import type { OngoingSurveySummary } from "@features/survey-list/service/surveyList/types";
import { topics } from "@shared/constants/topics";
import { formatRemainingTime } from "@shared/lib/FormatDate";
import { getUniqueSurveyIdsFromArrays } from "@shared/lib/surveyListUtils";
import type { SurveyListItem } from "@shared/types/surveyList";
import { useMemo } from "react";

const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

/** 훅 반환값: 추천/임박 리스트와 프로모션 총액 */
export interface ProcessedOngoingSurveysResult {
	recommended: SurveyListItem[];
	impending: SurveyListItem[];
	totalPromotionAmount: number;
}

export const useProcessedOngoingSurveys = (
	result:
		| {
				recommended?: OngoingSurveySummary[];
				impending?: OngoingSurveySummary[];
		  }
		| undefined,
): ProcessedOngoingSurveysResult => {
	return useMemo(() => {
		if (!result) {
			return {
				recommended: [],
				impending: [],
				totalPromotionAmount: 0,
			};
		}

		const mapSurveyToItem = (survey: OngoingSurveySummary): SurveyListItem => {
			const topicId =
				(survey.interests && survey.interests.length > 0
					? survey.interests[0]
					: survey.interest) ?? DEFAULT_TOPIC;
			const topic = topics.find((t) => t.id === topicId);
			const iconSrc = topic?.icon.type === "image" ? topic.icon.src : undefined;

			const remainingTime = formatRemainingTime(survey.deadline);
			return {
				id: String(survey.surveyId),
				topicId: topicId as SurveyListItem["topicId"],
				title: survey.title,
				iconType: iconSrc ? "image" : "icon",
				iconSrc,
				iconName: topic?.icon.type === "icon" ? topic.icon.name : undefined,
				description: survey.description,
				remainingTimeText: remainingTime,
				isClosed: remainingTime === "마감됨",
				isFree: survey.isFree,
				responseCount: survey.responseCount,
				price: survey.price,
			};
		};

		const filterClosedSurveys = (surveys?: OngoingSurveySummary[]) => {
			if (!surveys) return [];
			return surveys.filter((survey) => {
				const remainingTime = formatRemainingTime(survey.deadline);
				return remainingTime !== "마감됨";
			});
		};

		const filteredRecommended = filterClosedSurveys(result.recommended);
		const filteredImpending = filterClosedSurveys(result.impending);

		const rec = filteredRecommended.map(mapSurveyToItem);
		const imp = filteredImpending.map(mapSurveyToItem);

		const uniqueSurveyIds = getUniqueSurveyIdsFromArrays(
			result.recommended,
			result.impending,
		);
		const surveyIdToPrice = new Map<number, number>();
		for (const s of [
			...(result.recommended ?? []),
			...(result.impending ?? []),
		]) {
			surveyIdToPrice.set(s.surveyId, s.price ?? 200);
		}
		const totalAmount = Array.from(uniqueSurveyIds).reduce(
			(sum, id) => sum + (surveyIdToPrice.get(id) ?? 200),
			0,
		);

		return {
			recommended: rec,
			impending: imp,
			totalPromotionAmount: totalAmount,
		};
	}, [result]);
};
