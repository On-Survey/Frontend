// 문항 타입별 페이지 라우트 매핑
import type { QuestionType } from "../types/survey";

export const QUESTION_TYPE_ROUTES: Record<QuestionType, string> = {
	multipleChoice: "/createForm/multipleChoice",
	rating: "/createForm/rating",
	nps: "/createForm/nps",
	shortAnswer: "/createForm/shortAnswer",
	longAnswer: "/createForm/longAnswer",
	date: "/createForm/date",
	number: "/createForm/number",
};
