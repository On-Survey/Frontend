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

	const cardGradients = [
		"linear-gradient(180deg, var(--token-tds-color-grey-100, var(--adaptiveGrey100, #f2f4f6)) 0%, rgba(254, 237, 255, 1) 100%)",
		"linear-gradient(180deg, var(--token-tds-color-grey-100, var(--adaptiveGrey100, #f2f4f6)) 0%, rgba(255, 251, 236, 1) 100%)",
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

	if (surveys.length === 0) {
		return null;
	}

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
					{surveys.map((survey, index) => (
						<button
							key={survey.id}
							type="button"
							onClick={() => !survey.isClosed && handleSurveyClick(survey)}
							disabled={survey.isClosed}
							className={`rounded-2xl! p-4 shrink-0 flex flex-col w-[198px] min-h-[166px] text-left shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
								survey.isClosed
									? "cursor-not-allowed"
									: "cursor-pointer focus-visible:outline-2 "
							}`}
							style={{
								background: cardGradients[index % cardGradients.length],
							}}
						>
							<div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mb-3">
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
								<div className="flex items-center gap-1 mb-2">
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW16}
										backgroundColor="transparent"
										name="icon-clock-mono"
										color={adaptive.grey600}
										aria-hidden={true}
										ratio="1/1"
									/>
									<Text
										color={adaptive.grey700}
										typography="t7"
										className="line-clamp-2"
									>
										{survey.remainingTimeText}
									</Text>
								</div>
							) : (
								<div className="mb-2" />
							)}
							{typeof survey.isFree === "boolean" && (
								<div className="flex items-center gap-1 mb-3">
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW16}
										backgroundColor="transparent"
										name="icon-money-bag-point-mono"
										color={adaptive.grey600}
										aria-hidden={true}
										ratio="1/1"
									/>
									<Text
										color={adaptive.grey800}
										typography="t7"
										fontWeight="semibold"
									>
										{survey.isFree ? "보상이 없어요" : "200원"}
									</Text>
								</div>
							)}
							<div className="flex-1" />
							<span className="mt-auto inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-semibold text-gray-700 bg-gray-300/40">
								{survey.isClosed ? "마감" : "시작하기"}
							</span>
						</button>
					))}
				</div>
			</div>
		</>
	);
};
