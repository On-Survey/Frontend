import { graniteEvent } from "@apps-in-toss/web-framework";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";

interface UseQuestionBackHandlerOptions {
	questionId: string | undefined;
	questionIdFromUrl: string | null;
}

/**
 * 문항 생성/수정 페이지에서 뒤로가기 이벤트를 처리하는 훅
 * - 새로 생성 중인 문항(questionIdFromUrl이 없는 경우): 뒤로가기 시 문항 삭제
 * - 기존 문항 수정 중(questionIdFromUrl이 있는 경우): 뒤로가기만 수행
 */
export const useQuestionBackHandler = ({
	questionId,
	questionIdFromUrl,
}: UseQuestionBackHandlerOptions) => {
	const navigate = useNavigate();
	const { deleteQuestion } = useSurvey();

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				if (!questionIdFromUrl && questionId) {
					deleteQuestion(questionId);
				}
				navigate(-1);
			},
		});

		return unsubscription;
	}, [navigate, questionIdFromUrl, questionId, deleteQuestion]);
};
