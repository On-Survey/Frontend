// 설문 리스트 아이템 타입
export interface SurveyListItem {
	id: string;
	topicId: string;
	title: string;
	iconType: "image" | "icon";
	iconSrc?: string;
	iconName?: string;
}
