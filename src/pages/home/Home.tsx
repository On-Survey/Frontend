import { closeView } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeBanner from "../../assets/HomeBanner.png";
import { BottomNavigation } from "../../components/BottomNavigation";
import { ExitConfirmDialog } from "../../components/ExitConfirmDialog";
import { CustomSurveyList } from "../../components/surveyList/CustomSurveyList";
import { UrgentSurveyList } from "../../components/surveyList/UrgentSurveyList";
import { topics } from "../../constants/topics";
import { useUserInfo } from "../../contexts/UserContext";
import { useModal } from "../../hooks/UseToggle";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import type { OngoingSurveySummary } from "../../service/surveyList/types";
import type { SurveyListItem } from "../../types/surveyList";
import { formatRemainingTime } from "../../utils/FormatDate";
import { getUniqueSurveyIdsFromArrays } from "../../utils/surveyListUtils";
import { useGlobalStats } from "./hooks/useGlobalStats";
import { useOngoingSurveys } from "./hooks/useOngoingSurveys";

export const Home = () => {
	const navigate = useNavigate();

	const { userInfo } = useUserInfo();

	const { data: globalStats } = useGlobalStats();
	const { data: result, error: ongoingSurveysError } = useOngoingSurveys();
	// 3천대 랜덤 숫자 생성 (3000~3999)
	const [randomCount] = useState(() => {
		const random = Math.floor(Math.random() * 1000) + 3000;
		return random.toLocaleString();
	});

	// 온보딩 미완료 시 온보딩 페이지로 리다이렉트
	useEffect(() => {
		if (userInfo?.result && userInfo.result.isOnboardingCompleted === false) {
			navigate("/onboarding", { replace: true });
		}
	}, [userInfo, navigate]);

	const handleMySurvey = () => navigate("/mysurvey");
	const handleMyPage = () => navigate("/mypage");
	const handleViewAllRecommended = () =>
		navigate("/surveyList?type=recommended");
	const handleViewAllImpending = () => navigate("/surveyList?type=impending");
	const handleCreateSurvey = () => navigate("/createFormStart");
	const handleQuizClick = () => navigate("/oxScreening");

	const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

	const { recommended, impending, totalPromotionAmount } = useMemo(() => {
		if (!result) {
			return {
				recommended: [],
				impending: [],
				totalPromotionAmount: 0,
			};
		}

		const mapSurveyToItem = (survey: OngoingSurveySummary): SurveyListItem => {
			const topicId =
				(survey.interests && survey.interests.length > 0
					? survey.interests[0]
					: survey.interest) ?? DEFAULT_TOPIC;
			const topic = topics.find((t) => t.id === topicId);
			const iconSrc = topic?.icon.type === "image" ? topic.icon.src : undefined;

			const remainingTime = formatRemainingTime(survey.deadline);
			return {
				id: String(survey.surveyId),
				topicId: topicId as SurveyListItem["topicId"],
				title: survey.title,
				iconType: iconSrc ? "image" : "icon",
				iconSrc,
				iconName: topic?.icon.type === "icon" ? topic.icon.name : undefined,
				description: survey.description,
				remainingTimeText: remainingTime,
				isClosed: remainingTime === "마감됨",
			};
		};

		// 마감된 설문 필터링
		const filterClosedSurveys = (surveys?: OngoingSurveySummary[]) => {
			if (!surveys) return [];
			return surveys.filter((survey) => {
				const remainingTime = formatRemainingTime(survey.deadline);
				return remainingTime !== "마감됨";
			});
		};

		const filteredRecommended = filterClosedSurveys(result.recommended);
		const filteredImpending = filterClosedSurveys(result.impending);

		const rec = filteredRecommended.map(mapSurveyToItem);
		const imp = filteredImpending.map(mapSurveyToItem);

		const uniqueSurveyIds = getUniqueSurveyIdsFromArrays(
			result.recommended,
			result.impending,
		);

		const totalAmount = uniqueSurveyIds.size * 200;

		return {
			recommended: rec,
			impending: imp,
			totalPromotionAmount: totalAmount,
		};
	}, [result]);

	const customSurveysToShow = recommended.slice(0, 3);
	const urgentSurveysToShow = impending.slice(0, 3);

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

	return (
		<>
			<ExitConfirmDialog
				open={isConfirmDialogOpen}
				onCancel={handleConfirmDialogCancel}
				onConfirm={handleConfirmDialogConfirm}
			/>
			<div className="flex flex-col w-full min-h-screen">
				<div className="p-4">
					<div className="w-full h-fit rounded-[24px] p-4 backdrop-blur-none flex items-center gap-2 bg-gray-100">
						<Asset.Image
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							src="https://static.toss.im/2d-emojis/png/4x/u1F440.png"
							aria-hidden={true}
							style={{ aspectRatio: "1/1" }}
						/>
						<Text color={adaptive.grey800} typography="t6" fontWeight="medium">
							현재
						</Text>
						<Text
							color={adaptive.green400}
							typography="t6"
							fontWeight="semibold"
						>
							{randomCount}명
						</Text>
						<Text color={adaptive.grey800} typography="t6" fontWeight="medium">
							이 설문을 보고 있어요
						</Text>
					</div>
				</div>
				<div className="relative mx-4 mb-6 rounded-4xl overflow-hidden shrink-0 h-[337px]">
					<div className="absolute inset-0 home-banner-gradient" />
					<button
						type="button"
						className="absolute bottom-0 left-0 right-0 z-100 home-banner-overlay cursor-pointer border-0 bg-transparent p-0 w-full h-full"
						onClick={handleQuizClick}
					/>
					<div className="relative p-6 flex flex-col h-full">
						<div className="flex-1 flex flex-col justify-between">
							<div className="block">
								<Text
									color="white"
									typography="t2"
									fontWeight="bold"
									className="mb-2! z-999"
								>
									간단한 OX 퀴즈 풀고 <br />
									설문 참여 하기
								</Text>
							</div>

							<Button
								size="small"
								color="light"
								variant="weak"
								className="max-w-20 p-0.1! z-999"
								onClick={handleQuizClick}
								style={
									{
										"--button-background-color": "rgba(7, 44, 77, 0.20)",
										"--button-color": "#FFF",
										"--button-border-radius": "12px",
									} as React.CSSProperties
								}
							>
								퀴즈 풀기
							</Button>

							<div className="mt-auto">
								<Text
									color="white"
									typography="t5"
									fontWeight="bold"
									className="mb-1 z-999"
								>
									설문에 참여하면 {totalPromotionAmount.toLocaleString()}원을
									받을 수 있어요
								</Text>
								<Text
									color="white"
									typography="t6"
									fontWeight="regular"
									className="z-999 opacity-80"
								>
									지금까지
									{globalStats?.totalPromotionCount.toLocaleString() ?? 0}명이
									받았어요
								</Text>
								<ProgressBar
									size="normal"
									color="#15c67f"
									progress={
										globalStats && globalStats.totalCompletedCount > 0
											? globalStats.totalPromotionCount /
												globalStats.totalCompletedCount
											: 0
									}
									className="z-999 mt-2"
								/>
							</div>
						</div>
						<img
							src={homeBanner}
							alt="메인 배너"
							className="absolute bottom-0 right-0 h-100 object-contain opacity-90 z-1"
						/>
					</div>
				</div>

				<div className="px-4 pb-4">
					<div className="bg-green-50 rounded-2xl p-4 flex items-center justify-between ">
						<button
							type="button"
							onClick={handleCreateSurvey}
							className="flex-1 cursor-pointer text-left"
							style={{ background: "none", border: "none", padding: 0 }}
						>
							<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
								지금 바로 설문 제작해보기!
							</Text>
							<Text
								color={adaptive.grey600}
								typography="t7"
								fontWeight="regular"
							>
								설문 제작부터 응답 모집까지 간편하고 빠르게
							</Text>
						</button>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW60}
							backgroundColor="transparent"
							name="icon-document-check-lines-fill"
							aria-hidden={true}
							ratio="1/1"
						/>
					</div>
				</div>

				{/* 에러 UI */}
				{ongoingSurveysError && (
					<div className="px-4 py-6 text-center text-sm text-red-500">
						노출 중 설문 조회 실패
					</div>
				)}

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
