import type { InterestId } from "../constants/topics";

export interface SurveyListItem {
	id: string;
	topicId: InterestId;
	title: string;
	iconType: "image" | "icon";
	iconSrc?: string;
	iconName?: string;
	description?: string;
	remainingTimeText?: string;
	isClosed?: boolean;
	isFree?: boolean;
}
