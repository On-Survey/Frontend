// 문항 타입별 페이지 라우트 매핑
export const QUESTION_TYPE_ROUTES: Record<string, string> = {
	multiple_choice: "/createForm/multiple-choice",
	rating: "/createForm/rating",
	nps: "/createForm/nps",
	short_answer: "/createForm/short-answer",
	essay: "/createForm/essay",
	date: "/createForm/date",
	number: "/createForm/number",
};
