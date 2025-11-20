import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SurveyList } from "../components/surveyList/SurveyList";
import { topics } from "../constants/topics";
import {
	getImpendingSurveys,
	getOngoingSurveys,
	getRecommendedSurveys,
} from "../service/surveyList";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import type { SurveyListItem } from "../types/surveyList";
import { formatRemainingTime } from "../utils/FormatDate";

const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

export const SurveyListPage = () => {
	const [searchParams] = useSearchParams();
	const listType = searchParams.get("type"); // "recommended" | "impending" | null

	const [surveys, setSurveys] = useState<SurveyListItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNext, setHasNext] = useState(true);
	const [lastSurveyId, setLastSurveyId] = useState<number>(0);
	const [lastDeadline, setLastDeadline] = useState<string | undefined>(
		undefined,
	);
	const loadingRef = useRef<HTMLDivElement | null>(null);

	const mapSurveyToItem = useCallback(
		(survey: OngoingSurveySummary): SurveyListItem => {
			const topicId =
				(survey.interests && survey.interests.length > 0
					? survey.interests[0]
					: survey.interest) ?? DEFAULT_TOPIC;
			const topic = topics.find((t) => t.id === topicId);
			const iconSrc = topic?.icon.type === "image" ? topic.icon.src : undefined;

			return {
				id: String(survey.surveyId),
				topicId: topicId as SurveyListItem["topicId"],
				title: survey.title,
				iconType: iconSrc ? "image" : "icon",
				iconSrc,
				iconName: topic?.icon.type === "icon" ? topic.icon.name : undefined,
				description: survey.description,
			};
		},
		[],
	);

	const fetchSurveys = useCallback(
		async (reset = false) => {
			setIsLoading(true);

			try {
				const currentLastId = reset ? 0 : lastSurveyId;
				const currentLastDeadline = reset ? undefined : lastDeadline;

				let fetchedSurveys: OngoingSurveySummary[] = [];

				if (listType === "recommended") {
					const recommendedResult = await getRecommendedSurveys({
						lastSurveyId: currentLastId,
						size: 15,
					});
					fetchedSurveys =
						recommendedResult.data ?? recommendedResult.recommended ?? [];
					setHasNext(
						recommendedResult.hasNext ??
							recommendedResult.recommendedHasNext ??
							false,
					);
				} else if (listType === "impending") {
					const impendingResult = await getImpendingSurveys({
						lastSurveyId: currentLastId,
						lastDeadline: currentLastDeadline,
						size: 15,
					});
					fetchedSurveys =
						impendingResult.data ?? impendingResult.impending ?? [];
					setHasNext(
						impendingResult.hasNext ??
							impendingResult.impendingHasNext ??
							false,
					);
				} else {
					const result = await getOngoingSurveys({
						lastSurveyId: currentLastId,
						size: 15,
					});
					fetchedSurveys = [
						...(result.recommended ?? []),
						...(result.impending ?? []),
					];
					// 전체 목록의 경우 hasNext는 둘 중 하나라도 true면 true
					setHasNext(
						(result.recommendedHasNext ?? false) ||
							(result.impendingHasNext ?? false),
					);
				}

				const activeSurveys = fetchedSurveys.filter((survey) => {
					const remainingTime = formatRemainingTime(survey.deadline);
					return remainingTime !== "마감됨";
				});

				const mappedSurveys = activeSurveys.map(mapSurveyToItem);
				const uniqueSurveys = mappedSurveys.filter(
					(survey, index, self) =>
						index === self.findIndex((s) => s.id === survey.id),
				);

				if (reset) {
					setSurveys(uniqueSurveys);
				} else {
					setSurveys((prev) => {
						const combined = [...prev, ...uniqueSurveys];
						return combined.filter(
							(survey, index, self) =>
								index === self.findIndex((s) => s.id === survey.id),
						);
					});
				}

				if (activeSurveys.length > 0) {
					const lastSurvey = activeSurveys[activeSurveys.length - 1];
					setLastSurveyId(lastSurvey.surveyId);
					// 마감 임박 설문의 경우 lastDeadline도 업데이트
					if (listType === "impending" && lastSurvey.deadline) {
						setLastDeadline(lastSurvey.deadline);
					}
				}
			} catch (err) {
				console.error("설문 목록 조회 실패:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[lastSurveyId, lastDeadline, listType, mapSurveyToItem],
	);

	// listType이 변경되면 초기화하고 다시 불러오기
	useEffect(() => {
		setSurveys([]);
		setLastSurveyId(0);
		setLastDeadline(undefined);
		setHasNext(true);
		const fetch = async () => {
			setIsLoading(true);
			try {
				let fetchedSurveys: OngoingSurveySummary[] = [];

				if (listType === "recommended") {
					const recommendedResult = await getRecommendedSurveys({
						lastSurveyId: 0,
						size: 15,
					});
					fetchedSurveys =
						recommendedResult.data ?? recommendedResult.recommended ?? [];
					setHasNext(
						recommendedResult.hasNext ??
							recommendedResult.recommendedHasNext ??
							false,
					);
				} else if (listType === "impending") {
					const impendingResult = await getImpendingSurveys({
						lastSurveyId: 0,
						size: 15,
					});
					fetchedSurveys =
						impendingResult.data ?? impendingResult.impending ?? [];
					setHasNext(
						impendingResult.hasNext ??
							impendingResult.impendingHasNext ??
							false,
					);
				} else {
					const result = await getOngoingSurveys({
						lastSurveyId: 0,
						size: 15,
					});
					fetchedSurveys = [
						...(result.recommended ?? []),
						...(result.impending ?? []),
					];
					setHasNext(
						(result.recommendedHasNext ?? false) ||
							(result.impendingHasNext ?? false),
					);
				}

				const activeSurveys = fetchedSurveys.filter((survey) => {
					const remainingTime = formatRemainingTime(survey.deadline);
					return remainingTime !== "마감됨";
				});

				const mappedSurveys = activeSurveys.map(mapSurveyToItem);
				const uniqueSurveys = mappedSurveys.filter(
					(survey, index, self) =>
						index === self.findIndex((s) => s.id === survey.id),
				);

				setSurveys(uniqueSurveys);

				if (activeSurveys.length > 0) {
					const lastSurvey = activeSurveys[activeSurveys.length - 1];
					setLastSurveyId(lastSurvey.surveyId);
					if (listType === "impending" && lastSurvey.deadline) {
						setLastDeadline(lastSurvey.deadline);
					}
				}
			} catch (err) {
				console.error("설문 목록 조회 실패:", err);
			} finally {
				setIsLoading(false);
			}
		};
		void fetch();
	}, [listType, mapSurveyToItem]);

	useEffect(() => {
		if (!loadingRef.current || !hasNext || isLoading) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNext && !isLoading) {
					void fetchSurveys(false);
				}
			},
			{ threshold: 0.1 },
		);

		const currentLoadingRef = loadingRef.current;
		if (currentLoadingRef) {
			observer.observe(currentLoadingRef);
		}

		return () => {
			if (currentLoadingRef) {
				observer.unobserve(currentLoadingRef);
			}
		};
	}, [hasNext, isLoading, fetchSurveys]);

	return (
		<div className="flex flex-col w-full min-h-screen bg-white">
			{surveys.length === 0 && !isLoading ? (
				<div className="px-4 py-6 text-center">
					<Text color={adaptive.grey700} typography="t7">
						설문이 없습니다
					</Text>
				</div>
			) : (
				<>
					<SurveyList surveys={surveys} />
					{hasNext && (
						<div ref={loadingRef} className="px-4 py-6 text-center">
							{isLoading && (
								<Text color={adaptive.grey600} typography="t7">
									설문을 불러오는 중...
								</Text>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};
