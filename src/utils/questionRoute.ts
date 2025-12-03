import type { TransformedSurveyQuestion } from "../service/surveyParticipation";
import type { QuestionType } from "../types/survey";

//질문 타입에 따른 라우트 경로 반환
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

//질문 타입에 따른 결과 페이지 라우트 경로 반환
export const getQuestionResultRoute = (type: QuestionType): string => {
	const routes: Record<QuestionType, string> = {
		shortAnswer: "/result/shortAnswer",
		longAnswer: "/result/longAnswer",
		multipleChoice: "/result/multipleChoice",
		rating: "/result/rating",
		nps: "/result/nps",
		date: "/result/date",
		number: "/result/number",
	};
	return routes[type] || "/result/shortAnswer";
};
