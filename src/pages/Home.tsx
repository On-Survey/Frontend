import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import mainBanner from "../assets/mainBanner.svg";
import { BottomNavigation } from "../components/BottomNavigation";
import { CustomSurveyList } from "../components/surveyList/CustomSurveyList";
import { UrgentSurveyList } from "../components/surveyList/UrgentSurveyList";
import type { SurveyListItem } from "../types/surveyList";

// Mock user data
const USER_NAME = "온서베이";

const MOCK_SURVEYS: SurveyListItem[] = [
	{
		id: "1",
		topicId: "culture_hobby",
		title: "영화 시청 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F37F.png",
	},
	{
		id: "2",
		topicId: "health_lifestyle",
		title: "러닝 경험에 관한 설문",
		iconType: "image",
		iconSrc:
			"https://static.toss.im/2d-emojis/png/4x/u1F3C3_u200D_u2640_uFE0F.png",
	},
	{
		id: "3",
		topicId: "daily_relationships",
		title: "반려동물 외모 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F46B.png",
	},
];

export const Home = () => {
	const navigate = useNavigate();

	const handleMySurvey = () => {
		navigate("/mysurvey");
	};

	const handleViewAllSurveys = () => {
		navigate("/surveyList");
	};

	const handleCreateSurvey = () => {
		navigate("/createFormStart");
	};

	return (
		<div className="flex flex-col w-full min-h-screen">
			<div
				className="relative mx-4 mb-6 rounded-4xl overflow-hidden flex-shrink-0"
				style={{ height: "337px" }}
			>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(180deg, #59B5E8 3.52%, #37A6E4 15.71%, #D9D0EE 46.77%, #F1CFD6 59.46%, #FFE1E7 68.61%)",
						filter: "blur(10px)",
					}}
				/>
				<div
					className="absolute bottom-0 left-0 right-0 z-100"
					style={{
						background:
							"linear-gradient(180deg, rgba(71, 117, 178, 0.00) 60.95%, rgba(58, 95, 143, 0.60) 80.12%, #3A5F8F 90.2%)",
						filter: "blur(2px)",
						height: "100%",
					}}
				/>
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
							className="max-w-20 p-0.1!"
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

			<CustomSurveyList
				surveys={MOCK_SURVEYS}
				userName={USER_NAME}
				onViewAll={handleViewAllSurveys}
			/>

			<Border variant="height16" />

			<UrgentSurveyList onViewAll={handleViewAllSurveys} />

			<div className="mb-24" />

			<BottomNavigation currentPage="home" onMySurveyClick={handleMySurvey} />
		</div>
	);
};
