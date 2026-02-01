import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { topics } from "../../constants/topics";
import { getOngoingSurveys } from "../../service/surveyList";
import type { OngoingSurveySummary } from "../../service/surveyList/types";
import type { SurveyListItem } from "../../types/surveyList";
import { formatRemainingTime } from "../../utils/FormatDate";
import { pushGtmEvent } from "../../utils/gtm";

export const Ineligible = () => {
	const navigate = useNavigate();
	const [surveys, setSurveys] = useState<SurveyListItem[]>([]);

	const cardGradients = [
		"from-[#FFF4C2] to-[#FFE08A]",
		"from-[#E5DCFF] to-[#C9B7FF]",
	];

	useEffect(() => {
		const fetch = async () => {
			try {
				const result = await getOngoingSurveys();
				const DEFAULT_TOPIC: SurveyListItem["topicId"] = "DAILY_LIFE";

				const mapSurveyToItem = (
					survey: OngoingSurveySummary,
				): SurveyListItem => {
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
						isFree: survey.isFree,
					};
				};

				const combined = [
					...(result.recommended ?? []),
					...(result.impending ?? []),
				]
					.map(mapSurveyToItem)
					.filter((survey) => !survey.isClosed);

				// 중복 제거
				const unique = combined.filter(
					(survey, index, self) =>
						index === self.findIndex((s) => s.id === survey.id),
				);

				setSurveys(unique.slice(0, 5));
			} catch (err) {
				console.error("추천 설문 조회 실패:", err);
			}
		};

		void fetch();
	}, []);

	const handleSurveyClick = (survey: SurveyListItem) => {
		pushGtmEvent({
			event: "survey_start",
			pagePath: "/survey",
			survey_id: String(survey.id),
			source: "main",
			progress_percent: "0",
		});
		const searchParams = new URLSearchParams({ surveyId: survey.id });
		navigate(
			{
				pathname: "/survey",
				search: `?${searchParams.toString()}`,
			},
			{ state: { surveyId: survey.id, survey } },
		);
	};

	const renderIcon = (survey: SurveyListItem) => {
		if (survey.iconType === "image" && survey.iconSrc) {
			return (
				<Asset.Image
					frameShape={{ width: 20, height: 20 }}
					src={survey.iconSrc}
					aria-hidden={true}
				/>
			);
		}

		if (survey.iconType === "icon" && survey.iconName) {
			return (
				<Asset.Icon
					frameShape={{ width: 20, height: 20 }}
					name={survey.iconName}
					color={adaptive.grey500}
					aria-hidden={true}
				/>
			);
		}

		return (
			<Asset.Icon
				frameShape={{ width: 20, height: 20 }}
				name="icon-clock-pill"
				color={adaptive.grey500}
				aria-hidden={true}
			/>
		);
	};

	return (
		<div className="flex flex-col w-full h-screen justify-center">
			<div className="flex flex-col items-center py-10 px-6">
				<Asset.Image
					frameShape={Asset.frameShape.CleanW100}
					backgroundColor="transparent"
					src="https://static.toss.im/2d-emojis/png/4x/u1F625.png"
					aria-hidden={true}
					style={{ width: 100, height: 100 }}
				/>
				<div className="h-4" />
				<Text
					display="block"
					color={adaptive.grey800}
					typography="t3"
					fontWeight="bold"
					textAlign="center"
				>
					설문 조건에 맞지 않아
					<br />
					참여할 수 없어요.
				</Text>
				{surveys.length > 0 && (
					<div className="mt-4">
						<Text
							color={adaptive.grey700}
							typography="t5"
							fontWeight="semibold"
						>
							대신 이런 설문 어떠세요?
						</Text>
					</div>
				)}
			</div>

			<div className="overflow-x-auto overflow-y-hidden hide-scrollbar px-6">
				<div className="flex gap-3">
					{surveys.map((survey, index) => (
						<button
							key={survey.id}
							type="button"
							onClick={() => !survey.isClosed && handleSurveyClick(survey)}
							disabled={survey.isClosed}
							className={`rounded-2xl! p-4 shrink-0 flex flex-col w-[198px] min-h-[166px] text-left overflow-hidden bg-linear-to-b ${
								cardGradients[index % cardGradients.length]
							} shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
								survey.isClosed
									? "cursor-not-allowed opacity-50"
									: "cursor-pointer focus-visible:outline-2"
							}`}
						>
							<div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mb-3">
								{renderIcon(survey)}
							</div>
							<Text
								color={adaptive.grey800}
								typography="t6"
								fontWeight="bold"
								className="mb-2 line-clamp-2"
							>
								{survey.title}
							</Text>
							{survey.iconType === "image" && survey.remainingTimeText ? (
								<Text
									color={adaptive.grey700}
									typography="t7"
									className="mb-3 line-clamp-2"
								>
									{survey.remainingTimeText}
								</Text>
							) : (
								<div className="mb-3" />
							)}
							<div className="flex-1" />
							<span className="mt-auto inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-semibold text-gray-700 bg-white/30">
								{survey.isClosed ? "마감" : "시작하기"}
							</span>
						</button>
					))}
				</div>
			</div>

			<FixedBottomCTA
				loading={false}
				onClick={() => navigate("/home")}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				다른 설문 더보기
			</FixedBottomCTA>
		</div>
	);
};
