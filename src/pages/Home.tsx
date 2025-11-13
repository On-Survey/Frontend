// src/pages/Home.tsx
import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import mainBanner from "../assets/mainBanner.svg";
import { BottomNavigation } from "../components/BottomNavigation";
import { CustomSurveyList } from "../components/surveyList/CustomSurveyList";
import { UrgentSurveyList } from "../components/surveyList/UrgentSurveyList";
import { topics } from "../constants/topics";
import { getOngoingSurveys } from "../service/surveyList";
import type { OngoingSurveySummary } from "../service/surveyList/types";
import type { SurveyListItem } from "../types/surveyList";

const USER_NAME = "온서베이";

export const Home = () => {
	const navigate = useNavigate();

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

	// ... 위쪽 imports, state, mapToSurveyListItem 동일 ...

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getOngoingSurveys(); // { recommended, impending, hasNext }
				console.log("노출 중 설문 (recommended):", result.recommended);
				console.log("노출 중 설문 (impending):", result.impending);

				const mapSurveyToItem = (
					survey: OngoingSurveySummary,
				): SurveyListItem => {
					const topicId = survey.interest ?? DEFAULT_TOPIC;
					const topic = topics.find((t) => t.id === topicId);
					const iconSrc =
						topic?.icon.type === "image" ? topic.icon.src : undefined;

					return {
						id: String(survey.surveyId),
						topicId,
						title: survey.title,
						iconType: iconSrc ? "image" : "icon",
						iconSrc,
						iconName: topic?.icon.type === "icon" ? topic.icon.name : undefined,
						description: survey.description,
					};
				};

				const rec = (result.recommended ?? []).map(mapSurveyToItem);
				const imp = (result.impending ?? []).map(mapSurveyToItem);

				setRecommended(rec);
				setImpending(imp);
			} catch (err) {
				console.error("노출 중 설문 조회 실패:", err);
				setError("설문 목록을 불러오지 못했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		void fetch();
	}, []);

	const customSurveysToShow = recommended;

	// UrgentSurveyList에는 임박 설문을 그대로 전달
	const urgentSurveysToShow = impending;

	return (
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
						<Text color={adaptive.grey600} typography="t7" fontWeight="regular">
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
				userName={USER_NAME}
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
	);
};
