import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SurveyList } from "../components/surveyList/SurveyList";
import { topics } from "../constants/topics";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import type { SurveyListItem } from "../types/surveyList";
import { formatRemainingTime } from "../utils/FormatDate";
import { useImpendingSurveys } from "./surveyList/hooks/useImpendingSurveys";
import { useOngoingSurveysList } from "./surveyList/hooks/useOngoingSurveysList";
import { useRecommendedSurveys } from "./surveyList/hooks/useRecommendedSurveys";

const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

export const SurveyListPage = () => {
	const [searchParams] = useSearchParams();
	const listType = searchParams.get("type"); // "recommended" | "impending" | null

	const loadingRef = useRef<HTMLDivElement | null>(null);

	// React Query hooks - listType에 따라 조건부 활성화
	const recommendedQuery = useRecommendedSurveys(listType === "recommended");
	const impendingQuery = useImpendingSurveys(listType === "impending");
	const ongoingQuery = useOngoingSurveysList(
		!listType || (listType !== "recommended" && listType !== "impending"),
	);

	// 현재 활성화된 쿼리의 isLoading, isFetching, isFetchingNextPage 선택
	const isLoading =
		listType === "recommended"
			? recommendedQuery.isLoading ||
				recommendedQuery.isFetching ||
				recommendedQuery.isFetchingNextPage
			: listType === "impending"
				? impendingQuery.isLoading ||
					impendingQuery.isFetching ||
					impendingQuery.isFetchingNextPage
				: ongoingQuery.isLoading ||
					ongoingQuery.isFetching ||
					ongoingQuery.isFetchingNextPage;

	// 데이터 가공 - useInfiniteQuery의 pages를 flatten
	const { surveys, hasNext } = useMemo(() => {
		const allFetchedSurveys: OngoingSurveySummary[] = [];
		let hasNextValue = false;

		if (listType === "recommended" && recommendedQuery.data) {
			recommendedQuery.data.pages.forEach((page) => {
				const pageSurveys = page.data ?? page.recommended ?? [];
				allFetchedSurveys.push(...pageSurveys);
			});
			hasNextValue = recommendedQuery.hasNextPage ?? false;
		} else if (listType === "impending" && impendingQuery.data) {
			impendingQuery.data.pages.forEach((page) => {
				const pageSurveys = page.data ?? page.impending ?? [];
				allFetchedSurveys.push(...pageSurveys);
			});
			hasNextValue = impendingQuery.hasNextPage ?? false;
		} else if (!listType && ongoingQuery.data) {
			ongoingQuery.data.pages.forEach((page) => {
				allFetchedSurveys.push(
					...(page.recommended ?? []),
					...(page.impending ?? []),
				);
			});
			hasNextValue = ongoingQuery.hasNextPage ?? false;
		}

		const activeSurveys = allFetchedSurveys.filter((survey) => {
			const remainingTime = formatRemainingTime(survey.deadline);
			return remainingTime !== "마감됨";
		});

		const mapSurveyToItem = (survey: OngoingSurveySummary): SurveyListItem => {
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
		};

		const mappedSurveys = activeSurveys.map(mapSurveyToItem);
		const uniqueSurveys = mappedSurveys.filter(
			(survey, index, self) =>
				index === self.findIndex((s) => s.id === survey.id),
		);

		return { surveys: uniqueSurveys, hasNext: hasNextValue };
	}, [
		listType,
		recommendedQuery.data,
		recommendedQuery.hasNextPage,
		impendingQuery.data,
		impendingQuery.hasNextPage,
		ongoingQuery.data,
		ongoingQuery.hasNextPage,
	]);

	useEffect(() => {
		if (!loadingRef.current || !hasNext || isLoading) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNext && !isLoading) {
					if (listType === "recommended") {
						recommendedQuery.fetchNextPage();
					} else if (listType === "impending") {
						impendingQuery.fetchNextPage();
					} else {
						ongoingQuery.fetchNextPage();
					}
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
	}, [
		hasNext,
		isLoading,
		listType,
		recommendedQuery,
		impendingQuery,
		ongoingQuery,
	]);

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
