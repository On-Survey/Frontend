import { useToast } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useMultiStep } from "../contexts/MultiStepContext";
import { useSurvey } from "../contexts/SurveyContext";
import type { DraftSurvey } from "../pages/mysurvey/components/types";
import { getWritingSurvey } from "../service/mysurvey/api";
import type { WritingSurveyResult } from "../service/mysurvey/types";
import { convertWritingQuestionsToQuestions } from "../utils/writingQuestionConverter";

//작성 중인 설문 편집을 위한 커스텀 훅
export const useDraftSurvey = () => {
	const navigate = useNavigate();
	const { openToast } = useToast();
	const { loadSurvey, setSurveyId } = useSurvey();
	const { setSurveyStep } = useMultiStep();

	const handleDraftClick = async (surveyId: number, surveys: DraftSurvey[]) => {
		console.log("handleDraftClick called with surveyId:", surveyId);
		try {
			if (surveyId <= 0) {
				openToast("더미 설문은 편집할 수 없어요.", {
					type: "bottom",
					higherThanCTA: true,
				});
				return;
			}

			console.log("Fetching writing survey for surveyId:", surveyId);
			let data: WritingSurveyResult;
			try {
				data = await getWritingSurvey(surveyId);
				console.log("Writing survey data received:", data);
			} catch (error: unknown) {
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
					data = {
						surveyId,
						questions: [],
					};
				} else {
					throw error;
				}
			}

			const surveyInfo = surveys.find((s) => s.id === surveyId);
			const questions = convertWritingQuestionsToQuestions(data.questions);

			loadSurvey({
				title: surveyInfo?.title ?? "",
				description: surveyInfo?.description ?? "",
				question: questions,
			});
			setSurveyId(data.surveyId);
			setSurveyStep(1);
			navigate("/createForm", {
				state: { source: "mysurvey_edit", surveyId: data.surveyId },
			});

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
