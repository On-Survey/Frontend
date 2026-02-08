import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import { Asset, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import homeBanner from "../../../assets/HomeBanner.png";
import { useGlobalStats } from "../hooks/useGlobalStats";

export interface HomeGlobalStatsSectionProps {
	totalPromotionAmount: number;
}

export const HomeGlobalStatsSection = ({
	totalPromotionAmount,
}: HomeGlobalStatsSectionProps) => {
	const navigate = useNavigate();
	const { data: globalStats } = useGlobalStats();

	const handleQuizClick = () => {
		pushGtmEvent({
			event: "start_screening_quiz",
			source: "메인에서 진입(main)",
		});
		navigate("/oxScreening");
	};

	return (
		<>
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
					<Text color={adaptive.green400} typography="t6" fontWeight="semibold">
						{globalStats ? globalStats.dailyUserCount.toLocaleString() : 0}명
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
								설문에 참여하면 {totalPromotionAmount.toLocaleString()}원을 받을
								수 있어요
							</Text>
							<Text
								color="white"
								typography="t6"
								fontWeight="regular"
								className="z-999 opacity-80"
							>
								지금까지{" "}
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
		</>
	);
};
