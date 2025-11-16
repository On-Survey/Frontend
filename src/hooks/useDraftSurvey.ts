import { useToast } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useMultiStep } from "../contexts/MultiStepContext";
import { useSurvey } from "../contexts/SurveyContext";
import type { DraftSurvey } from "../pages/mysurvey/components/types";
import { getWritingSurvey } from "../service/mysurvey/api";
import type { WritingSurveyResult } from "../service/mysurvey/types";
import { convertWritingQuestionsToQuestions } from "../utils/writingQuestionConverter";

/**
 * 작성 중인 설문 편집을 위한 커스텀 훅
 */
export const useDraftSurvey = () => {
	const navigate = useNavigate();
	const { openToast } = useToast();
	const { loadSurvey, setSurveyId } = useSurvey();
	const { setActiveStep } = useMultiStep();

	const handleDraftClick = async (surveyId: number, surveys: DraftSurvey[]) => {
		console.log("handleDraftClick called with surveyId:", surveyId);
		try {
			// 더미 설문은 처리하지 않음
			if (surveyId <= 0) {
				openToast("더미 설문은 편집할 수 없어요.", {
					type: "bottom",
					higherThanCTA: true,
				});
				return;
			}

			console.log("Fetching writing survey for surveyId:", surveyId);
			// 작성 중인 설문 데이터 조회
			let data: WritingSurveyResult;
			try {
				data = await getWritingSurvey(surveyId);
				console.log("Writing survey data received:", data);
			} catch (error: unknown) {
				// 404 에러인 경우: 설문이 아직 문항이 없을 수 있음
				if (
					error &&
					typeof error === "object" &&
					"response" in error &&
					error.response &&
					typeof error.response === "object" &&
					"status" in error.response &&
					error.response.status === 404
				) {
					console.log("Survey has no questions yet, creating empty survey");
					// 빈 설문으로 처리
					data = {
						surveyId,
						questions: [],
					};
				} else {
					throw error;
				}
			}

			// surveys 배열에서 해당 설문의 제목과 설명 찾기
			const surveyInfo = surveys.find((s) => s.id === surveyId);

			// WritingQuestion을 Question으로 변환
			const questions = convertWritingQuestionsToQuestions(data.questions);

			// SurveyContext에 설문 데이터 로드
			loadSurvey({
				title: surveyInfo?.title ?? "",
				description: surveyInfo?.description ?? "",
				question: questions,
			});

			// surveyId 설정
			setSurveyId(data.surveyId);

			// MultiStep을 QuestionHome(step 1)로 설정
			setActiveStep(1);

			// 작성 페이지로 이동
			navigate("/createForm");

			openToast(`문항 ${data.questions.length}개 불러왔어요.`, {
				type: "bottom",
				higherThanCTA: true,
			});
		} catch (error) {
			openToast("작성 중인 설문을 불러오지 못했어요.", {
				type: "bottom",
				higherThanCTA: true,
			});
			console.error("작성 중 설문 조회 실패:", error);
		}
	};

	return { handleDraftClick };
};
