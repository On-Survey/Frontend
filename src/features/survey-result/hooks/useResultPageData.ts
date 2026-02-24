import type { ResultPageState } from "@shared/types/surveyResponse";
import { useLocation } from "react-router-dom";

//Result 페이지에서 location state로부터 데이터를 가져오는 커스텀 훅
export const useResultPageData = () => {
	const location = useLocation();
	const state = location.state as ResultPageState | null;

	const question = state?.question;
	const answerMap = state?.answerMap || {};
	const answerList = state?.answerList || [];
	const surveyTitle = state?.surveyTitle || "설문 제목";
	const surveyStatus = state?.surveyStatus || "active";
	const responseCount = state?.responseCount || 0;
	const totalAnswerCount = state?.totalAnswerCount;
	const isRequired = question?.isRequired ?? true;

	const requiredLabel = isRequired ? "필수" : "선택";

	return {
		question,
		answerMap,
		answerList,
		surveyTitle,
		surveyStatus,
		responseCount,
		totalAnswerCount,
		isRequired,
		requiredLabel,
	};
};
