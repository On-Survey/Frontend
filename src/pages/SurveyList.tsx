import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { SurveyList } from "../components/surveyList/SurveyList";
import { topics } from "../constants/topics";
import { getOngoingSurveys } from "../service/surveyList";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import type { SurveyListItem } from "../types/surveyList";

const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

export const SurveyListPage = () => {
	const [surveys, setSurveys] = useState<SurveyListItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNext, setHasNext] = useState(true);
	const [lastSurveyId, setLastSurveyId] = useState<number>(0);
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
				const result = await getOngoingSurveys({
					lastSurveyId: currentLastId,
					size: 15,
				});

				const allSurveys = [
					...(result.recommended ?? []),
					...(result.impending ?? []),
				];

				const mappedSurveys = allSurveys.map(mapSurveyToItem);
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

				setHasNext(result.hasNext ?? false);

				if (allSurveys.length > 0) {
					const lastId = Math.max(...allSurveys.map((s) => s.surveyId));
					setLastSurveyId(lastId);
				}
			} catch (err) {
				console.error("설문 목록 조회 실패:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[lastSurveyId, mapSurveyToItem],
	);

	useEffect(() => {
		void fetchSurveys(true);
	}, [fetchSurveys]);

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
