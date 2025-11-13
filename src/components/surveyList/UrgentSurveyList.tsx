import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

import type { SurveyListItem } from "../../types/surveyList";

interface UrgentSurveyListProps {
	surveys: SurveyListItem[];
	onViewAll?: () => void;
}

export const UrgentSurveyList = ({
	surveys,
	onViewAll,
}: UrgentSurveyListProps) => {
	const navigate = useNavigate();
	const fallbackSurveys: SurveyListItem[] = [
		{
			id: "mock-urgent-1",
			topicId: "CAREER",
			title: "커리어 만족도 설문",
			iconType: "image",
			iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F680.png",
			description: "5분 만에 참여하고 포인트 보상 받아가세요!",
			remainingTimeText: "마감 하루 전",
		},
	];
	const displaySurveys = surveys.length > 0 ? surveys : fallbackSurveys;

	const cardGradients = [
		"from-[#FFF4C2] to-[#FFE08A]",
		"from-[#E5DCFF] to-[#C9B7FF]",
	];

	const handleSurveyClick = (survey: SurveyListItem) => {
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
		<>
			<div className="px-4 pt-4 pb-3">
				<div className="flex items-center justify-between">
					<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
						마감 임박 설문
					</Text>
					<button type="button" onClick={onViewAll} aria-label="더보기">
						<Text color={adaptive.grey700} typography="t6">
							더보기
						</Text>
					</button>
				</div>
			</div>

			<div className="overflow-x-auto overflow-y-hidden hide-scrollbar px-4">
				<div className="flex gap-3">
					{displaySurveys.length === 0 ? (
						<div className="rounded-2xl p-4 flex-shrink-0 flex items-center justify-center w-[198px] min-h-[166px] bg-gray-100 text-center">
							<Text color={adaptive.grey700} typography="t7">
								마감 임박 설문이 없습니다.
							</Text>
						</div>
					) : (
						displaySurveys.map((survey, index) => (
							<button
								key={survey.id}
								type="button"
								onClick={() => handleSurveyClick(survey)}
								className={`rounded-2xl p-4 flex-shrink-0 flex flex-col w-[198px] min-h-[166px] text-left bg-gradient-to-b ${
									cardGradients[index % cardGradients.length]
								} shadow-[0_8px_24px_rgba(15,23,42,0.05)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
							>
								<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-3">
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
								<span className="mt-auto inline-flex h-9 items-center justify-center rounded-xl border border-gray-900 px-4 text-sm font-semibold text-gray-900">
									시작하기
								</span>
							</button>
						))
					)}
				</div>
			</div>
		</>
	);
};
