import { closeView } from "@apps-in-toss/web-framework";
import { getScreenings } from "@features/survey/service/surveyParticipation/api";
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
import { useAllOngoingSurveys } from "../hooks/useAllOngoingSurveys";
import { useProcessedOngoingSurveys } from "../hooks/useProcessedOngoingSurveys";
import { HomeGlobalStatsSectionLoading } from "../ui/HomeGlobalStatsSectionLoading";
import { OngoingSurveysErrorFallback } from "../ui/OngoingSurveysErrorFallback";
import { ThrowOnError } from "../ui/ThrowOnError";
export const Home = () => {
	const navigate = useNavigate();

	const { userInfo } = useUserInfo();

	// 모든 설문 조회 (세그먼트 불일치 포함)
	const {
		data: allSurveysData,
		error: allSurveysError,
		refetch: refetchOngoingSurveys,
	} = useAllOngoingSurveys();

	// 스크리닝 정보 조회 (세그멘테이션에 일치하는 설문의 스크리닝 문항)
	const { data: screeningsData, error: screeningsError } = useQuery({
		queryKey: ["screenings"],
		queryFn: () => getScreenings({ lastSurveyId: 0, size: 100 }), // 충분히 큰 size로 모든 스크리닝 정보 가져오기
	});

	// 스크리닝이 있는 설문 ID Set 생성
	const surveysWithScreening = useMemo(() => {
		if (!screeningsData?.data) return new Set<number>();
		return new Set(screeningsData.data.map((screening) => screening.surveyId));
	}, [screeningsData]);

	// ongoing/all API 결과를 processed 형태로 변환
	const { recommended } = useProcessedOngoingSurveys(
		allSurveysData
			? {
					recommended: allSurveysData.surveys || [],
					impending: [],
				}
			: undefined,
	);

	// 스크리닝 정보를 설문 목록에 추가
	const surveysWithScreeningInfo = useMemo(() => {
		return recommended.map((survey) => {
			const surveyId = Number(survey.id);
			const hasScreening = surveysWithScreening.has(surveyId);
			// ongoing/all API에서 받은 isEligible 필드 사용
			const originalSurvey = allSurveysData?.surveys.find(
				(s) => s.surveyId === surveyId,
			);
			const isEligible = originalSurvey?.isEligible ?? false;

			return {
				...survey,
				hasScreening,
				isEligible,
			};
		});
	}, [recommended, surveysWithScreening, allSurveysData]);

	// 에러 처리
	const hasError = allSurveysError || screeningsError;

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
	// 설문 목록 (중복 제거)
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

	const hasNoSurveys =
		allSurveysData != null && !hasError && allSurveys.length === 0;

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
						<ThrowOnError error={allSurveysError || screeningsError} />
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
									<CustomSurveyList surveys={allSurveys} />

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
