import { SurveyList } from "../components/surveyList/SurveyList";
import type { SurveyListItem } from "../types/surveyList";

// Mock
const MOCK_ALL_SURVEYS: SurveyListItem[] = [
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
	{
		id: "4",
		topicId: "career",
		title: "이직 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F9F3.png",
	},
	{
		id: "5",
		topicId: "business_tech",
		title: "AI 사용 경험에 관한 설문",
		iconType: "icon",
		iconName: "icon-it",
	},
	{
		id: "6",
		topicId: "finance_consumption",
		title: "투자 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F4B8.png",
	},
	{
		id: "7",
		topicId: "fashion_beauty",
		title: "패션 스타일링 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F576.png",
	},
	{
		id: "8",
		topicId: "social_issues",
		title: "환경 인식에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F310.png",
	},
	{
		id: "9",
		topicId: "self_development_education",
		title: "자격증 공부 경험에 관한 설문",
		iconType: "image",
		iconSrc: "https://static.toss.im/2d-emojis/png/4x/u1F58B.png",
	},
];

export const SurveyListPage = () => {
	return (
		<div className="flex flex-col w-full min-h-screen bg-white">
			<SurveyList surveys={MOCK_ALL_SURVEYS} />
		</div>
	);
};
