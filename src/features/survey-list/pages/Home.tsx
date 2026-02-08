import { closeView } from "@apps-in-toss/web-framework";
import { BottomNavigation } from "@shared/components/BottomNavigation";
import { ExitConfirmDialog } from "@shared/components/ExitConfirmDialog";
import { useUserInfo } from "@shared/contexts/UserContext";
import { useModal } from "@shared/hooks/UseToggle";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import { Border, Text } from "@toss/tds-mobile";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import formBanner from "../../../assets/formBanner.png";
import { CustomSurveyList } from "../components/CustomSurveyList";
import { HomeGlobalStatsSection } from "../components/HomeGlobalStatsSection";
import { UrgentSurveyList } from "../components/UrgentSurveyList";
import { useOngoingSurveys } from "../hooks/useOngoingSurveys";
import { useProcessedOngoingSurveys } from "../hooks/useProcessedOngoingSurveys";
import { HomeGlobalStatsSectionLoading } from "../ui/HomeGlobalStatsSectionLoading";
import { OngoingSurveysErrorFallback } from "../ui/OngoingSurveysErrorFallback";
import { ThrowOnError } from "../ui/ThrowOnError";
export const Home = () => {
	const navigate = useNavigate();

	const { userInfo } = useUserInfo();

	const {
		data: result,
		error: ongoingSurveysError,
		refetch: refetchOngoingSurveys,
	} = useOngoingSurveys();

	const { recommended, impending, totalPromotionAmount } =
		useProcessedOngoingSurveys(result);

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

	const handleMySurvey = () => navigate("/mysurvey");
	const handleMyPage = () => navigate("/mypage");
	const handleViewAllRecommended = () =>
		navigate("/surveyList?type=recommended");
	const handleViewAllImpending = () => navigate("/surveyList?type=impending");
	const handleCreateSurvey = () => {
		pushGtmEvent({
			event: "main_banner_click",
			pagePath: "/home",
			source: "home_ad_main",
		});
		navigate("/google-form-conversion-landing", {
			state: { source: "main_cta" },
		}); //구글폼 설문 랜딩 페이지로 이동
	};
	const handleQuizClick = () => {
		pushGtmEvent({
			event: "start_screening_quiz",
			// pagePath: "/home",
			source: "메인에서 진입(main)",
		});
		navigate("/oxScreening");
	};

	const customSurveysToShow = recommended.slice(0, 3);
	const urgentSurveysToShow = impending.slice(0, 3);

	const hasNoSurveys =
		result != null &&
		!ongoingSurveysError &&
		recommended.length === 0 &&
		impending.length === 0;

	return (
		<>
			<ExitConfirmDialog
				open={isConfirmDialogOpen}
				onCancel={handleConfirmDialogCancel}
				onConfirm={handleConfirmDialogConfirm}
			/>
			<div className="flex flex-col w-full min-h-screen">
				<Suspense fallback={<HomeGlobalStatsSectionLoading />}>
					<HomeGlobalStatsSection
						totalPromotionAmount={totalPromotionAmount}
						onQuizClick={handleQuizClick}
					/>
				</Suspense>

				<div className="px-4 pb-4">
					<div className="bg-gray-50 rounded-[24px] flex items-center justify-between gap-4">
						<button
							type="button"
							onClick={handleCreateSurvey}
							className="flex-1 p-4"
							style={{ background: "none", border: "none", padding: 0 }}
						>
							<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
								구글폼으로 설문 등록하기
							</Text>
							<Text
								color={adaptive.grey600}
								typography="t7"
								fontWeight="regular"
							>
								등록만 하면 패널에게 즉시 노출
							</Text>
						</button>
						<img
							src={formBanner}
							alt="구글폼 배너"
							className="h-full max-h-[84px] w-auto object-contain"
						/>
					</div>
				</div>

				<ErrorBoundary
					FallbackComponent={(props) => (
						<OngoingSurveysErrorFallback
							{...props}
							onRetry={refetchOngoingSurveys}
						/>
					)}
				>
					{ongoingSurveysError ? (
						<ThrowOnError error={ongoingSurveysError} />
					) : (
						<>
							{/* 설문 없음 UI */}
							{hasNoSurveys && (
								<div className="px-4 pb-4">
									<div
										className="rounded-2xl px-4 py-8 flex flex-col items-center justify-center gap-2 min-h-[140px]"
										style={{ backgroundColor: adaptive.grey50 }}
									>
										<Text
											color={adaptive.grey700}
											typography="t6"
											fontWeight="medium"
										>
											아직 노출 중인 설문이 없어요
										</Text>
										<Text
											color={adaptive.grey500}
											typography="t7"
											fontWeight="regular"
										>
											곧 새로운 설문이 올라올 거예요
										</Text>
									</div>
								</div>
							)}

							{!hasNoSurveys && (
								<>
									{userInfo?.result?.name && (
										<CustomSurveyList
											surveys={customSurveysToShow}
											userName={userInfo.result.name}
											onViewAll={handleViewAllRecommended}
										/>
									)}

									<Border variant="height16" />

									<UrgentSurveyList
										surveys={urgentSurveysToShow}
										onViewAll={handleViewAllImpending}
									/>
								</>
							)}
						</>
					)}
				</ErrorBoundary>

				<div className="mb-24" />

				<BottomNavigation
					currentPage="home"
					onMySurveyClick={handleMySurvey}
					onMyPageClick={handleMyPage}
				/>
			</div>
		</>
	);
};
