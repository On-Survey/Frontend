import { useCallback, useEffect, useRef, useState } from "react";
import {
	getSurveyAnswerDetail,
	getUserSurveys,
	type SurveyAnswerDetailFilters,
} from "../service/mysurvey/api";
import type { SurveyAnswerDetailResult } from "../service/mysurvey/types";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "../types/surveyResponse";
import { mapApiQuestionTypeToComponentType } from "../utils/questionFactory";

// 설문 응답 상세 정보를 가져오는 훅
export const useSurveyAnswerDetail = (
	surveyId: string | undefined,
	filters: SurveyAnswerDetailFilters,
) => {
	const [surveyResponse, setSurveyResponse] =
		useState<SurveyResponseDetailType | null>(null);
	const [answerDetails, setAnswerDetails] =
		useState<SurveyAnswerDetailResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [userSurveysResult, setUserSurveysResult] = useState<Awaited<
		ReturnType<typeof getUserSurveys>
	> | null>(null);
	const [userSurveysLoaded, setUserSurveysLoaded] = useState(false);

	const lastFiltersRef = useRef<string | null>(null);

	useEffect(() => {
		const fetchUserSurveys = async () => {
			try {
				const result = await getUserSurveys();
				setUserSurveysResult(result);
			} catch (error) {
				console.error("getUserSurveys 실패:", error);
				setUserSurveysResult(null);
			} finally {
				setUserSurveysLoaded(true);
			}
		};

		void fetchUserSurveys();
	}, []);

	const fetchSurveyDetail = useCallback(
		async (filterParams: SurveyAnswerDetailFilters) => {
			if (!surveyId) return;

			const filterKey = JSON.stringify(filterParams);

			if (
				lastFiltersRef.current !== null &&
				lastFiltersRef.current === filterKey
			) {
				return;
			}
			lastFiltersRef.current = filterKey;

			try {
				setIsLoading(true);
				const result = await getSurveyAnswerDetail(
					Number(surveyId),
					filterParams,
				);

				if (!result) {
					const survey = userSurveysResult?.infoList.find(
						(s) => s.surveyId === Number(surveyId),
					);
					setSurveyResponse({
						id: Number(surveyId),
						title: survey?.title || "설문",
						status: "active",
						responseCount: survey?.currentCount ?? 0,
						questions: [],
					});
					return;
				}

				setAnswerDetails(result);

				const survey = userSurveysResult?.infoList.find(
					(s) => s.surveyId === result.surveyId,
				);
				const status: "active" | "closed" =
					result.status === "ONGOING" || result.status === "ACTIVE"
						? "active"
						: "closed";

				const questions = result.detailInfoList.map((detail) => {
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

				setSurveyResponse({
					id: result.surveyId,
					title: survey?.title || result.surveyId.toString() || "설문",
					status,
					responseCount: result.currentCount,
					questions,
				});
			} catch (_error) {
				const survey = userSurveysResult?.infoList.find(
					(s) => s.surveyId === Number(surveyId),
				);
				setSurveyResponse({
					id: Number(surveyId),
					title: survey?.title || "설문",
					status: "active",
					responseCount: 0,
					questions: [],
				});
			} finally {
				setIsLoading(false);
			}
		},
		[surveyId, userSurveysResult],
	);

	// 필터가 변경되었을 때 API 호출
	useEffect(() => {
		if (userSurveysLoaded) {
			void fetchSurveyDetail(filters);
		}
	}, [userSurveysLoaded, fetchSurveyDetail, filters]);

	return {
		surveyResponse,
		answerDetails,
		isLoading,
	};
};
