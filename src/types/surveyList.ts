// 설문 리스트 아이템 타입
import type { InterestId } from "../constants/topics";

export interface SurveyListItem {
	id: string;
	topicId: InterestId;
	title: string;
	iconType: "image" | "icon";
	iconSrc?: string;
	iconName?: string;
}
