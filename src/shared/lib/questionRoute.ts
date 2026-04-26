import type { TransformedSurveyQuestion } from "../../features/survey/service/surveyParticipation";
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
		image: "/survey/shortAnswer", // 이미지 문항은 섹션 설문에서만 표시
		title: "/survey/shortAnswer", // 타이틀 문항은 섹션 설문에서만 표시
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
		image: "/result/shortAnswer", // 이미지 문항 결과는 단답형과 동일 경로
		title: "/result/shortAnswer", // 타이틀 문항 결과는 단답형과 동일 경로
	};
	return routes[type] || "/result/shortAnswer";
};
