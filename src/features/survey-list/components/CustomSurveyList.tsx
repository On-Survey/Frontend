import { topics } from "@shared/constants/topics";
import { pushGtmEvent } from "@shared/lib/gtm";
import type { SurveyListItem } from "@shared/types/surveyList";
import { adaptive } from "@toss/tds-colors";
import { Asset, List, ListRow, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

interface CustomSurveyListProps {
	surveys: SurveyListItem[];
	userName?: string;
	viewAllPath?: string;
}

export const CustomSurveyList = ({ surveys }: CustomSurveyListProps) => {
	const navigate = useNavigate();

	const handleSurveyClick = (survey: SurveyListItem) => {
		pushGtmEvent({
			event: "survey_start",
			pagePath: "/survey",
			survey_id: String(survey.id),
			source: "main",
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

	if (surveys.length === 0) {
		return (
			<div className="px-4 pb-4">
				<div
					className="w-full h-fit rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
					style={{
						backgroundColor: "var(--adaptiveCardBgGrey)",
						backdropFilter: "blur(0px)",
					}}
				>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW40}
						backgroundColor="transparent"
						name="icon-emoji-loudly-crying-face"
						aria-hidden={true}
						ratio="1/1"
					/>
					<Text color={adaptive.grey800} typography="t5" fontWeight="semibold">
						참여 가능한 설문이 없어요
					</Text>
					<Text color={adaptive.grey700} typography="t7" fontWeight="medium">
						참여 가능한 설문이 생기면 알림으로 알려드릴게요
					</Text>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="px-8 pt-2">
				<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
					참여 가능한 설문
				</Text>
			</div>

			<List>
				{surveys.map((survey) => {
					// 스크리닝 정보 확인
					const surveyWithScreening = survey as SurveyListItem & {
						hasScreening?: boolean;
					};
					const hasScreening = surveyWithScreening.hasScreening ?? false;

					// top 텍스트 결정
					const topText = hasScreening ? "스크리닝 O" : "스크리닝 X";

					// interest(topicId) 기반으로 아이콘 가져오기
					const topic = topics.find((t) => t.id === survey.topicId);
					const icon = topic?.icon;

					return (
						<ListRow
							key={survey.id}
							onClick={() => handleSurveyClick(survey)}
							left={
								icon?.type === "image" && icon.src ? (
									<div className="flex bg-gray-100 rounded-full p-2 items-center justify-center w-10 h-10">
										<ListRow.AssetImage
											src={icon.src}
											shape="original"
											className="w-[20px]"
										/>
									</div>
								) : (
									<ListRow.Icon
										shape="circle-background"
										name={icon?.name || survey.iconName || "icon-box-cat-grey"}
									/>
								)
							}
							contents={
								<ListRow.Texts
									type="3RowTypeC"
									top={topText}
									topProps={{ color: "#03b26c" }}
									middle={survey.title}
									middleProps={{ color: adaptive.grey800, fontWeight: "bold" }}
									bottom={survey.isFree ? "보상이 없어요" : "200원 획득"}
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							verticalPadding="large"
							arrowType="right"
						/>
					);
				})}
			</List>
		</>
	);
};
