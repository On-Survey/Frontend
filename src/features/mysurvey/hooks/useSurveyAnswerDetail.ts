import {
	getSurveyAnswerDetail,
	type SurveyAnswerDetailFilters,
} from "@features/mysurvey/service/mysurvey/api";
import { mapApiQuestionTypeToComponentType } from "@shared/lib/questionFactory";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "@shared/types/surveyResponse";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useUserSurveys } from "./useUserSurveys";

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
			// 복수 선택 가능한 CHOICE 타입의 경우 respondentCount 사용
			// 없으면 기존 방식으로 계산 (하위 호환성)
			const responseCount =
				detail.type === "CHOICE" && detail.respondentCount !== undefined
					? detail.respondentCount
					: (detail.type === "CHOICE" ||
								detail.type === "RATING" ||
								detail.type === "NPS") &&
							detail.answerMap
						? Object.values(detail.answerMap).reduce(
								(sum, count) => sum + count,
								0,
							)
						: detail.answerList?.length || 0;

			return {
				id: String(detail.questionId),
				title: detail.title,
				type: questionType,
				required: detail.isRequired,
				responseCount,
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
