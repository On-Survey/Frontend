import { adaptive } from "@toss/tds-colors";
import { List, ListRow, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { topics } from "../../constants/topics";
import type { SurveyListItem } from "../../types/surveyList";

const getTopicTag = (topicId: string): string => {
	const topic = topics.find((t) => t.id === topicId);
	return topic ? `#${topic.name}` : `#${topicId}`;
};

interface CustomSurveyListProps {
	surveys: SurveyListItem[];
	userName: string;
	onViewAll?: () => void;
}

export const CustomSurveyList = ({
	surveys,
	userName,
	onViewAll,
}: CustomSurveyListProps) => {
	const navigate = useNavigate();

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

	return (
		<>
			<div className="px-4 pb-3">
				<div className="flex items-center justify-between">
					<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
						{userName}님 맞춤 설문
					</Text>
					<button type="button" onClick={onViewAll} aria-label="더보기">
						<Text color={adaptive.grey700} typography="t6">
							더보기
						</Text>
					</button>
				</div>
			</div>

			{surveys.length > 0 && (
				<List>
					{surveys.map((survey) => (
						<ListRow
							key={survey.id}
							onClick={() => handleSurveyClick(survey)}
							contents={
								<ListRow.Texts
									type="3RowTypeC"
									top={getTopicTag(survey.topicId)}
									topProps={{ color: adaptive.blue500 }}
									middle={survey.title}
									middleProps={{ color: adaptive.grey800, fontWeight: "bold" }}
									bottom="3분이면 300원 획득"
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							left={
								<div className="flex bg-gray-100 rounded-full p-2 items-center justify-center w-10 h-10">
									{survey.iconType === "image" ? (
										<ListRow.AssetImage
											src={survey.iconSrc || ""}
											shape="original"
											className="w-[20px]"
										/>
									) : (
										<ListRow.AssetIcon name={survey.iconName || ""} />
									)}
								</div>
							}
							verticalPadding="large"
							arrowType="right"
						/>
					))}
				</List>
			)}
		</>
	);
};
