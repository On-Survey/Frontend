import {
	getSurveyAnswerDetail,
	type SurveyAnswerDetailFilters,
} from "@features/mysurvey/service/mysurvey/api";
import { mapApiQuestionTypeToComponentType } from "@shared/lib/questionFactory";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "@shared/types/surveyResponse";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useUserSurveys } from "./useUserSurveys";

const sumNumericValues = (answerMap: Record<string, unknown> | undefined) =>
	Object.values(answerMap ?? {}).reduce<number>(
		(sum, value) => sum + (typeof value === "number" ? value : 0),
		0,
	);

const sumNestedNumericValues = (
	gridAnswerMap: Record<string, Record<string, number>> | undefined,
) =>
	Object.values(gridAnswerMap ?? {}).reduce<number>(
		(total, rowMap) =>
			total + sumNumericValues(rowMap as Record<string, unknown>),
		0,
	);

export const useSurveyAnswerDetail = (
	surveyId: string | undefined,
	filters: SurveyAnswerDetailFilters,
) => {
	const { draftSurveys, activeSurveys, closedSurveys } = useUserSurveys();
	const {
		data: answerDetails,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["surveyAnswerDetail", surveyId, filters],
		queryFn: () => {
			return getSurveyAnswerDetail(Number(surveyId), filters);
		},
		enabled: !!surveyId,
	});

	const surveyResponse = useMemo<SurveyResponseDetailType | null>(() => {
		if (!surveyId) return null;

		if (error || !answerDetails) return null;

		const allSurveys = [...draftSurveys, ...activeSurveys, ...closedSurveys];
		const survey = allSurveys.find((s) => s.id === Number(surveyId));

		const status: "active" | "closed" =
			answerDetails.status === "ONGOING" || answerDetails.status === "ACTIVE"
				? "active"
				: "closed";

		const questions = answerDetails.detailInfoList.map((detail) => {
			const questionType = mapApiQuestionTypeToComponentType(detail.type);
			const aggregatedCount = sumNumericValues(
				detail.answerMap as Record<string, unknown>,
			);
			const aggregatedGridCount = sumNestedNumericValues(detail.gridAnswerMap);
			const fallbackAggregatedCount =
				aggregatedCount > 0 ? aggregatedCount : aggregatedGridCount;
			const responseCount =
				detail.respondentCount ??
				(fallbackAggregatedCount > 0 ? fallbackAggregatedCount : 0);
			const normalizedResponseCount =
				responseCount > 0 ? responseCount : (detail.answerList?.length ?? 0);

			return {
				id: String(detail.questionId),
				title: detail.title,
				type: questionType,
				required: detail.isRequired,
				responseCount: normalizedResponseCount,
				order: detail.order,
			};
		});

		return {
			id: answerDetails.surveyId,
			title: survey?.title || "설문",
			status,
			responseCount: answerDetails.currentCount,
			questions,
		};
	}, [
		surveyId,
		answerDetails,
		error,
		draftSurveys,
		activeSurveys,
		closedSurveys,
	]);

	return {
		surveyResponse,
		answerDetails: answerDetails || null,
		isLoading,
	};
};
