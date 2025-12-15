import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	getSurveyAnswerDetail,
	type SurveyAnswerDetailFilters,
} from "../service/mysurvey/api";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "../types/surveyResponse";
import { mapApiQuestionTypeToComponentType } from "../utils/questionFactory";
import { useUserSurveys } from "./useUserSurveys";

export const useSurveyAnswerDetail = (
	surveyId: string | undefined,
	filters: SurveyAnswerDetailFilters,
) => {
	const { draftSurveys, activeSurveys, closedSurveys } = useUserSurveys();
	const userSurveysResult = useMemo(() => {
		return {
			infoList: [
				...draftSurveys.map((s) => ({
					surveyId: s.id,
					title: s.title,
					currentCount: 0,
				})),
				...activeSurveys.map((s) => ({
					surveyId: s.id,
					title: s.title,
					currentCount: s.progress,
				})),
				...closedSurveys.map((s) => ({
					surveyId: s.id,
					title: s.title,
					currentCount: 0,
				})),
			],
		};
	}, [draftSurveys, activeSurveys, closedSurveys]);

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

		if (error || !answerDetails) {
			const survey = userSurveysResult.infoList.find(
				(s) => s.surveyId === Number(surveyId),
			);
			return {
				id: Number(surveyId),
				title: survey?.title || "설문",
				status: "active",
				responseCount: survey?.currentCount ?? 0,
				questions: [],
			};
		}

		const survey = userSurveysResult.infoList.find(
			(s) => s.surveyId === answerDetails.surveyId,
		);
		const status: "active" | "closed" =
			answerDetails.status === "ONGOING" || answerDetails.status === "ACTIVE"
				? "active"
				: "closed";

		const questions = answerDetails.detailInfoList.map((detail) => {
			const questionType = mapApiQuestionTypeToComponentType(detail.type);
			const responseCount =
				detail.type === "CHOICE" && detail.answerMap
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
			title: survey?.title || answerDetails.surveyId.toString() || "설문",
			status,
			responseCount: answerDetails.currentCount,
			questions,
		};
	}, [surveyId, answerDetails, error, userSurveysResult]);

	return {
		surveyResponse,
		answerDetails: answerDetails || null,
		isLoading,
	};
};
