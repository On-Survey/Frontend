import { closeView, graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import mainBanner from "../assets/mainBanner.svg";
import { BottomNavigation } from "../components/BottomNavigation";
import { ExitConfirmDialog } from "../components/ExitConfirmDialog";
import { CustomSurveyList } from "../components/surveyList/CustomSurveyList";
import { UrgentSurveyList } from "../components/surveyList/UrgentSurveyList";
import { topics } from "../constants/topics";
import { useModal } from "../hooks/UseToggle";
import { getOngoingSurveys } from "../service/surveyList";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import { getMemberInfo } from "../service/userInfo";
import type { SurveyListItem } from "../types/surveyList";
import { formatRemainingTime } from "../utils/FormatDate";

export const Home = () => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		const fetchMemberInfo = async () => {
			try {
				const memberInfo = await getMemberInfo();
				setUserName(memberInfo.name);
			} catch (err) {
				console.error("회원 정보 조회 실패:", err);
				setUserName("회원");
			}
		};

		void fetchMemberInfo();
	}, []);

	const [recommended, setRecommended] = useState<SurveyListItem[]>([]);
	const [impending, setImpending] = useState<SurveyListItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleMySurvey = () => navigate("/mysurvey");
	const handleMyPage = () => navigate("/mypage");
	const handleViewAllSurveys = () => navigate("/surveyList");
	const handleCreateSurvey = () => navigate("/createFormStart");
	const handleQuizClick = () => navigate("/oxScreening");

	const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getOngoingSurveys();
				const mapSurveyToItem = (
					survey: OngoingSurveySummary,
				): SurveyListItem => {
					// interests 배열이 오면 첫 번째 값을 사용, 없으면 interest 단수 값 사용
					const topicId =
						(survey.interests && survey.interests.length > 0
							? survey.interests[0]
							: survey.interest) ?? DEFAULT_TOPIC;
					const topic = topics.find((t) => t.id === topicId);
					const iconSrc =
						topic?.icon.type === "image" ? topic.icon.src : undefined;

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

				const rec = (result.recommended ?? []).map(mapSurveyToItem);
				const imp = (result.impending ?? []).map(mapSurveyToItem);

				setRecommended(rec);
				setImpending(imp);
			} catch (err) {
				console.error("노출 중 설문 조회 실패:", err);
			} finally {
				setIsLoading(false);
			}
		};

		void fetch();
	}, []);

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

	useEffect(() => {
		// 웹뷰 환경에서만 graniteEvent 사용
		if (
			typeof window !== "undefined" &&
			(window as { __GRANITE_NATIVE_EMITTER?: unknown })
				.__GRANITE_NATIVE_EMITTER
		) {
			try {
				const unsubscription = graniteEvent.addEventListener("backEvent", {
					onEvent: () => {
						handleConfirmDialogOpen();
					},
					onError: (error) => {
						console.error("Granite event error:", error);
					},
				});

				return unsubscription;
			} catch (error) {
				console.error("Failed to add granite event listener:", error);
			}
		}
	}, [handleConfirmDialogOpen]);

	return (
		<>
			<ExitConfirmDialog
				open={isConfirmDialogOpen}
				onCancel={handleConfirmDialogCancel}
				onConfirm={handleConfirmDialogConfirm}
			/>
			<div className="flex flex-col w-full min-h-screen">
				<div className="relative mx-4 mb-6 rounded-4xl overflow-hidden flex-shrink-0 h-[337px]">
					<div className="absolute inset-0 home-banner-gradient" />
					<div className="absolute bottom-0 left-0 right-0 z-100 home-banner-overlay" />
					<div className="relative p-6 flex flex-col h-full">
						<div className="flex-1 flex flex-col justify-between">
							<div className="block">
								<Text
									color="white"
									typography="t2"
									fontWeight="bold"
									className="mb-2!"
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
									설문에 참여하면 50,000원을 받을 수 있어요
								</Text>
								<Text
									color="white"
									typography="t6"
									fontWeight="regular"
									className="z-999 opacity-80"
								>
									지금까지 34,092명이 받았어요
								</Text>
								<ProgressBar
									size="normal"
									color="#FFFFFF"
									progress={0.55}
									className="z-999 mt-2"
								/>
							</div>
						</div>
						<img
							src={mainBanner}
							alt="메인 배너"
							className="absolute bottom-0 right-0 h-100 object-contain opacity-90 z-1"
						/>
					</div>
				</div>

				<div className="px-4 pb-4">
					<div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between ">
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
							name="icon-document-lines-blue"
							aria-hidden={true}
							ratio="1/1"
						/>
					</div>
				</div>

				{/* 에러 / 로딩 UI */}
				{isLoading && (
					<div className="px-4 py-6 text-center text-sm text-gray-500">
						설문을 불러오는 중입니다...
					</div>
				)}
				{error && (
					<div className="px-4 py-6 text-center text-sm text-red-500">
						{error}
					</div>
				)}

				<CustomSurveyList
					surveys={customSurveysToShow}
					userName={userName || "온서베이"}
					onViewAll={handleViewAllSurveys}
				/>

				<Border variant="height16" />

				<UrgentSurveyList
					surveys={urgentSurveysToShow}
					onViewAll={handleViewAllSurveys}
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
