import { Interest } from "@features/create-survey/service/form/types";

// 주제 데이터 타입 정의
export type InterestId =
	| "CAREER"
	| "BUSINESS"
	| "FINANCE"
	| "HEALTH"
	| "CULTURE"
	| "FASHION"
	| "SOCIETY"
	| "SELF_IMPROVEMENT"
	| "DAILY_LIFE";

export interface TopicData {
	id: InterestId;
	name: string;
	description: string;
	icon: {
		type: "image" | "icon";
		src?: string;
		name?: string;
	};
	value: Interest;
}

// 주제 데이터 배열
export const topics: TopicData[] = [
	{
		id: "CAREER",
		name: "커리어",
		description: "직장, 취업, 이직, 스타트업, 생산성",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F9F3.png",
		},
		value: Interest.CAREER,
	},
	{
		id: "BUSINESS",
		name: "비즈니스 / 테크",
		description: "데이터, AI, 마케팅, 앱",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F4BB.png",
		},
		value: Interest.BUSINESS,
	},
	{
		id: "FINANCE",
		name: "금융 / 소비",
		description: "재테크, 투자, 금융상품, 소비습관",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F4B8.png",
		},
		value: Interest.FINANCE,
	},
	{
		id: "HEALTH",
		name: "건강 / 라이프스타일",
		description: "운동, 다이어트, 식습관, 건강관리",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F3C3_u200D_u2640_uFE0F.png",
		},
		value: Interest.HEALTH,
	},
	{
		id: "CULTURE",
		name: "문화 / 취미",
		description: "영화, 음악, 책, 게임, 여행",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F37F.png",
		},
		value: Interest.CULTURE,
	},
	{
		id: "FASHION",
		name: "패션 / 뷰티",
		description: "트렌드, 코디, 스타일링, 화장, 옷",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F576.png",
		},
		value: Interest.FASHION,
	},
	{
		id: "SOCIETY",
		name: "사회 / 이슈",
		description: "환경, 기후, 이슈, 지속가능성",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F310.png",
		},
		value: Interest.SOCIETY,
	},
	{
		id: "SELF_IMPROVEMENT",
		name: "자기계발 / 교육",
		description: "공부, 강의, 자격증, 외국어 공부",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F58B.png",
		},
		value: Interest.SELF_IMPROVEMENT,
	},
	{
		id: "DAILY_LIFE",
		name: "일상 / 관계",
		description: "연애, 가족, 친구, 반려동물, 인간관계",
		icon: {
			type: "image",
			src: "https://static.toss.im/2d-emojis/png/4x/u1F46B.png",
		},
		value: Interest.DAILY_LIFE,
	},
];
