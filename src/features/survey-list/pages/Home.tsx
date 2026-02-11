import { closeView } from "@apps-in-toss/web-framework";
import {
	getScreenings,
	getSurveyInfo,
} from "@features/survey/service/surveyParticipation/api";
import { BottomNavigation } from "@shared/components/BottomNavigation";
import { ExitConfirmDialog } from "@shared/components/ExitConfirmDialog";
import { useUserInfo } from "@shared/contexts/UserContext";
import { useModal } from "@shared/hooks/UseToggle";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { pushGtmEvent } from "@shared/lib/gtm";
import { useQuery } from "@tanstack/react-query";
import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { Suspense, useEffect, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { CustomSurveyList } from "../components/CustomSurveyList";
import { GoogleFormCreateSurveyBanner } from "../components/GoogleFormCreateSurveyBanner";
import { HomeGlobalStatsSection } from "../components/HomeGlobalStatsSection";
import { useImpendingSurveys } from "../hooks/useImpendingSurveys";
import { useOngoingSurveys } from "../hooks/useOngoingSurveys";
import { useProcessedOngoingSurveys } from "../hooks/useProcessedOngoingSurveys";
import { useRecommendedSurveys } from "../hooks/useRecommendedSurveys";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import { HomeGlobalStatsSectionLoading } from "../ui/HomeGlobalStatsSectionLoading";
import { OngoingSurveysErrorFallback } from "../ui/OngoingSurveysErrorFallback";
import { ThrowOnError } from "../ui/ThrowOnError";
export const Home = () => {
	const navigate = useNavigate();

	const { userInfo } = useUserInfo();

	const {
		data: ongoingResult,
		error: ongoingSurveysError,
		refetch: refetchOngoingSurveys,
	} = useOngoingSurveys();

	const { data: recommendedData, error: recommendedError } =
		useRecommendedSurveys(true);

	const { data: impendingData, error: impendingError } =
		useImpendingSurveys(true);

	// 스크리닝 정보 조회 (세그멘테이션에 일치하는 설문의 스크리닝 문항)
	const { data: screeningsData, error: screeningsError } = useQuery({
		queryKey: ["screenings"],
		queryFn: () => getScreenings({ lastSurveyId: 0, size: 100 }), // 충분히 큰 size로 모든 스크리닝 정보 가져오기
	});

	// 스크리닝이 있는 설문 ID Set 생성 (스크리닝 API에서 반환되는 설문들은 세그멘테이션에 일치하는 설문)
	const surveysWithScreening = useMemo(() => {
		if (!screeningsData?.data) return new Set<number>();
		return new Set(screeningsData.data.map((screening) => screening.surveyId));
	}, [screeningsData]);

	// 세 개의 API 결과를 합쳐서 처리 (중복 제거)
	const combinedResult = useMemo(() => {
		const ongoing = ongoingResult || { recommended: [], impending: [] };

		// recommended API에서 첫 페이지 데이터 추출
		const recommendedFromApi = recommendedData?.pages?.[0];
		const recommendedSurveys =
			recommendedFromApi?.data || recommendedFromApi?.recommended || [];

		// impending API에서 첫 페이지 데이터 추출
		const impendingFromApi = impendingData?.pages?.[0];
		const impendingSurveys =
			impendingFromApi?.data || impendingFromApi?.impending || [];

		// 모든 recommended 설문 합치기 (중복 제거)
		const allRecommended = [
			...(ongoing.recommended || []),
			...recommendedSurveys,
		];
		const recommendedSeen = new Set<number>();
		const uniqueRecommended = allRecommended.filter((survey) => {
			if (recommendedSeen.has(survey.surveyId)) {
				return false;
			}
			recommendedSeen.add(survey.surveyId);
			return true;
		});

		// 모든 impending 설문 합치기 (중복 제거)
		const allImpending = [...(ongoing.impending || []), ...impendingSurveys];
		const impendingSeen = new Set<number>();
		const uniqueImpending = allImpending.filter((survey) => {
			if (impendingSeen.has(survey.surveyId)) {
				return false;
			}
			impendingSeen.add(survey.surveyId);
			return true;
		});

		return {
			recommended: uniqueRecommended,
			impending: uniqueImpending,
		};
	}, [ongoingResult, recommendedData, impendingData]);

	const { recommended, impending } = useProcessedOngoingSurveys(combinedResult);

	// 스크리닝 API에서 반환된 설문 ID 중 기존 목록에 없는 것들 찾기
	const missingSurveyIds = useMemo(() => {
		if (!screeningsData?.data) return [];
		const existingSurveyIds = new Set([
			...recommended.map((s) => Number(s.id)),
			...impending.map((s) => Number(s.id)),
		]);
		return screeningsData.data
			.map((screening) => screening.surveyId)
			.filter((surveyId) => !existingSurveyIds.has(surveyId));
	}, [screeningsData, recommended, impending]);

	// 누락된 설문 정보 가져오기
	const missingSurveysQueries = useQuery({
		queryKey: ["missingSurveys", missingSurveyIds],
		queryFn: async () => {
			if (missingSurveyIds.length === 0) return [];
			const surveyInfos = await Promise.all(
				missingSurveyIds.map((surveyId) => getSurveyInfo(surveyId)),
			);
			// OngoingSurveySummary 형태로 변환
			return surveyInfos.map((info, index): OngoingSurveySummary => {
				const interestId = info.interests?.[0];
				return {
					surveyId: missingSurveyIds[index],
					memberId: 0, // 정보 없음
					title: info.title,
					description: info.description || "",
					interest: interestId as OngoingSurveySummary["interest"] | undefined,
					interests:
						(info.interests as OngoingSurveySummary["interests"]) || [],
					deadline: info.deadline,
					isFree: info.isFree,
					responseCount: info.responseCount,
				};
			});
		},
		enabled: missingSurveyIds.length > 0,
	});

	// 누락된 설문을 processed 형태로 변환 (useProcessedOngoingSurveys 로직 직접 사용)
	const missingSurveysProcessed = useProcessedOngoingSurveys(
		missingSurveysQueries.data && missingSurveysQueries.data.length > 0
			? { recommended: missingSurveysQueries.data, impending: [] }
			: undefined,
	);

	// 모든 설문 합치기 (기존 + 누락된 설문)
	const allSurveysCombined = useMemo(() => {
		return [
			...recommended,
			...impending,
			...missingSurveysProcessed.recommended,
		];
	}, [recommended, impending, missingSurveysProcessed]);

	// 세그먼트가 맞는 설문 ID Set 생성 (recommended/impending에 있는 설문은 세그먼트가 맞는 설문)
	const eligibleSurveyIds = useMemo(() => {
		const ids = new Set<number>();
		[...recommended, ...impending].forEach((survey) => {
			ids.add(Number(survey.id));
		});
		return ids;
	}, [recommended, impending]);

	// 스크리닝 정보를 설문 목록에 추가
	const surveysWithScreeningInfo = useMemo(() => {
		return allSurveysCombined.map((survey) => {
			const surveyId = Number(survey.id);
			const hasScreening = surveysWithScreening.has(surveyId);
			// recommended/impending에 있는 설문은 세그먼트가 맞는 설문
			const isEligible = eligibleSurveyIds.has(surveyId);

			return {
				...survey,
				hasScreening,
				isEligible,
			};
		});
	}, [allSurveysCombined, surveysWithScreening, eligibleSurveyIds]);

	// 에러 처리
	const hasError =
		ongoingSurveysError ||
		recommendedError ||
		impendingError ||
		screeningsError;

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleConfirmDialogCancel = () => {
		handleConfirmDialogClose();
	};

	const handleConfirmDialogConfirm = () => {
		handleConfirmDialogClose();
		closeView();
	};

	useBackEventListener(handleConfirmDialogOpen);

	// 온보딩 미완료 시 온보딩 페이지로 리다이렉트
	useEffect(() => {
		if (userInfo?.result && userInfo.result.isOnboardingCompleted === false) {
			navigate("/onboarding", { replace: true });
		}
	}, [userInfo, navigate]);

	// 자동 로그인 완료 시 이벤트 로깅
	useEffect(() => {
		pushGtmEvent({
			event: "login",
			pagePath: "/home",
			method: "로그인 수단 (Toss)",
		});
	}, []);
	// 스크리닝 정보가 포함된 설문 목록에서 중복 제거
	const allSurveys = useMemo(() => {
		// surveyId 기준으로 중복 제거
		const seen = new Set<string>();
		const uniqueSurveys = surveysWithScreeningInfo.filter((survey) => {
			if (seen.has(survey.id)) {
				return false;
			}
			seen.add(survey.id);
			return true;
		});
		return uniqueSurveys;
	}, [surveysWithScreeningInfo]);

	const customSurveysToShow = allSurveys.slice(0, 3);

	const hasNoSurveys =
		(ongoingResult != null ||
			recommendedData != null ||
			impendingData != null) &&
		!hasError &&
		allSurveys.length === 0;

	return (
		<>
			<ExitConfirmDialog
				open={isConfirmDialogOpen}
				onCancel={handleConfirmDialogCancel}
				onConfirm={handleConfirmDialogConfirm}
			/>
			<div className="flex flex-col w-full min-h-screen">
				<Suspense fallback={<HomeGlobalStatsSectionLoading />}>
					<HomeGlobalStatsSection />
				</Suspense>
				<GoogleFormCreateSurveyBanner />
				<ErrorBoundary
					FallbackComponent={(props) => (
						<OngoingSurveysErrorFallback
							{...props}
							onRetry={refetchOngoingSurveys}
						/>
					)}
				>
					{hasError ? (
						<ThrowOnError
							error={
								ongoingSurveysError ||
								recommendedError ||
								impendingError ||
								screeningsError
							}
						/>
					) : (
						<>
							{/* 설문 없음 UI */}
							{hasNoSurveys && (
								<div className="px-4 pb-4">
									<div
										className="rounded-2xl px-4 py-8 flex flex-col items-center justify-center gap-2 min-h-[140px]"
										style={{ backgroundColor: adaptive.grey50 }}
									>
										<Asset.Icon
											frameShape={Asset.frameShape.CleanW40}
											backgroundColor="transparent"
											name="icon-emoji-loudly-crying-face"
											aria-hidden={true}
											ratio="1/1"
										/>
										<Text
											color={adaptive.grey800}
											typography="t5"
											fontWeight="semibold"
										>
											참여 가능한 설문이 없어요
										</Text>
										<Text
											color={adaptive.grey700}
											typography="t7"
											fontWeight="medium"
										>
											참여 가능한 설문이 생기면 알림으로 알려드릴게요
										</Text>
									</div>
								</div>
							)}

							{!hasNoSurveys && (
								<>
									<CustomSurveyList surveys={customSurveysToShow} />

									{/* <Border variant="height16" />

									<UrgentSurveyList surveys={urgentSurveysToShow} /> */}
								</>
							)}
						</>
					)}
				</ErrorBoundary>
				<div className="mb-24" />
				<BottomNavigation currentPage="home" />
			</div>
		</>
	);
};
