import { adaptive } from "@toss/tds-colors";
import { List, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { topics } from "../../constants/topics";
import type { SurveyListItem } from "../../types/surveyList";

const getTopicTag = (topicId: string): string => {
	const topic = topics.find((t) => t.id === topicId);
	return topic ? `#${topic.name}` : `#${topicId}`;
};

const getSurveyIcon = (survey: SurveyListItem) => {
	const topic = topics.find((t) => t.id === survey.topicId);
	if (topic) {
		return {
			type: topic.icon.type,
			src: topic.icon.src,
			name: topic.icon.name,
		};
	}
	return {
		type: survey.iconType,
		src: survey.iconSrc,
		name: survey.iconName,
	};
};

interface SurveyListProps {
	surveys: SurveyListItem[];
}

export const SurveyList = ({ surveys }: SurveyListProps) => {
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
		<List>
			{surveys.map((survey) => {
				const icon = getSurveyIcon(survey);
				return (
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
								{icon.type === "image" && icon.src ? (
									<ListRow.AssetImage
										src={icon.src}
										shape="original"
										className="w-8"
									/>
								) : icon.name ? (
									<ListRow.AssetIcon name={icon.name} />
								) : (
									<ListRow.AssetImage
										src={survey.iconSrc || ""}
										shape="original"
										className="w-8"
									/>
								)}
							</div>
						}
						verticalPadding="large"
						arrowType="right"
					/>
				);
			})}
		</List>
	);
};
