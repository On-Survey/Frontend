import type { TransformedSurveyQuestion } from "../service/surveyParticipation";

/**
 * 질문 타입에 따른 라우트 경로 반환
 */
export const getQuestionTypeRoute = (
	type: TransformedSurveyQuestion["type"],
): string => {
	const routes: Record<TransformedSurveyQuestion["type"], string> = {
		multipleChoice: "/survey/singleChoice",
		rating: "/survey/rating",
		nps: "/survey/nps",
		shortAnswer: "/survey/shortAnswer",
		longAnswer: "/survey/essay",
		date: "/survey/date",
		number: "/survey/number",
	};
	return routes[type] || "/survey/shortAnswer";
};
