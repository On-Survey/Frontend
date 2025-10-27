import { colors } from "@toss/tds-colors";
import { Asset, Badge, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";
import { SurveyTabNavigation } from "../components/SurveyTabNavigation";

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState("0-전체");

	const handleAddSurvey = () => {
		navigate("/create");
	};

	// Mock
	const draftSurveys = [{ id: 1, title: "영화 시청 경험에 관한 설문" }];
	const activeSurveys = [
		{
			id: 1,
			title: "영화 시청 경험에 관한 설문",
			progress: 56,
			total: 70,
			deadline: "10월 26일까지",
		},
	];
	const closedSurveys = [{ id: 1, title: "고양이 야옹 시청 경험에 관한 설문" }];

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<SurveyTabNavigation
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
			/>
			<div className="h-4" />

			{/* 내용 영역 */}
			<div className="flex-1 px-4 pb-24 overflow-y-auto">
				{/* 작성중 탭 */}
				{selectedTab === "1-작성중" && (
					<div className="space-y-4">
						{draftSurveys.map((survey) => (
							<div
								key={survey.id}
								className="bg-gray-50 rounded-xl p-4 relative"
							>
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="green" size="small">
										작성중
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
								>
									{survey.title}
								</Text>
							</div>
						))}
					</div>
				)}

				{/* 노출중 탭 */}
				{selectedTab === "2-노출중" && (
					<div className="space-y-4">
						{activeSurveys.map((survey) => (
							<div key={survey.id} className="bg-gray-50 rounded-xl p-4">
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="blue" size="small">
										노출중
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
									className="mb-3"
								>
									{survey.title}
								</Text>
								<div className="flex items-center justify-between mb-2">
									<Text
										color={colors.grey700}
										typography="t7"
										fontWeight="medium"
									>
										{survey.progress}/{survey.total}
									</Text>
									<Text
										color={colors.grey700}
										typography="t7"
										fontWeight="medium"
									>
										{survey.deadline}
									</Text>
								</div>
								<div className="mb-4">
									<ProgressBar
										size="normal"
										color={colors.blue500}
										progress={survey.progress / survey.total}
									/>
								</div>
								<div className="h-4" />
								<Button size="medium" variant="weak" display="block">
									친구에게 공유하기
								</Button>
							</div>
						))}
					</div>
				)}

				{/* 마감 탭 */}
				{selectedTab === "3-마감" && (
					<div className="space-y-4">
						{closedSurveys.map((survey) => (
							<div
								key={survey.id}
								className="bg-gray-50 rounded-xl p-4 relative"
							>
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="elephant" size="small">
										마감
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
								>
									{survey.title}
								</Text>
							</div>
						))}
					</div>
				)}

				{/* 전체 탭 - 모든 설문 표시 */}
				{selectedTab === "0-전체" && (
					<div className="space-y-4">
						{/* 작성중 설문 */}
						{draftSurveys.map((survey) => (
							<div
								key={`draft-${survey.id}`}
								className="bg-gray-50 rounded-xl p-4 relative"
							>
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="green" size="small">
										작성중
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
								>
									{survey.title}
								</Text>
							</div>
						))}
						{/* 노출중 설문 */}
						{activeSurveys.map((survey) => (
							<div
								key={`active-${survey.id}`}
								className="bg-gray-50 rounded-xl p-4"
							>
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="blue" size="small">
										노출중
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
									className="mb-3"
								>
									{survey.title}
								</Text>
								<div className="flex items-center justify-between mb-2">
									<Text
										color={colors.grey700}
										typography="t7"
										fontWeight="medium"
									>
										{survey.progress}/{survey.total}
									</Text>
									<Text
										color={colors.grey700}
										typography="t7"
										fontWeight="medium"
									>
										{survey.deadline}
									</Text>
								</div>
								<div className="mb-4">
									<ProgressBar
										size="normal"
										color={colors.blue500}
										progress={survey.progress / survey.total}
									/>
								</div>
								<div className="h-4" />
								<Button size="medium" variant="weak" display="block">
									친구에게 공유하기
								</Button>
							</div>
						))}
						{/* 마감 설문 */}
						{closedSurveys.map((survey) => (
							<div
								key={`closed-${survey.id}`}
								className="bg-gray-50 rounded-xl p-4 relative"
							>
								<div className="flex items-start justify-between mb-2">
									<Badge variant="weak" color="elephant" size="small">
										마감
									</Badge>
									<button
										type="button"
										className="cursor-pointer"
										aria-label="더보기"
									>
										<Asset.Icon
											frameShape={{ width: 24, height: 24 }}
											name="icn-arrow-rightwards"
											backgroundColor="transparent"
											color={colors.grey600}
											aria-hidden={true}
										/>
									</button>
								</div>
								<Text
									display="block"
									color={colors.grey800}
									typography="st8"
									fontWeight="semibold"
								>
									{survey.title}
								</Text>
							</div>
						))}
					</div>
				)}
			</div>

			{/* 설문 추가하기 버튼 */}
			<div className="fixed bottom-25 right-4">
				<Button size="medium" onClick={handleAddSurvey}>
					설문 추가하기
				</Button>
			</div>

			{/* 하단 네비게이션 */}
			<BottomNavigation currentPage="mysurvey" />
		</div>
	);
};
