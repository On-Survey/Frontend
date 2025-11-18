import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TransformedSurveyQuestion } from "../service/surveyParticipation";
import { submitSurveyParticipation } from "../service/surveyParticipation";
import type { SurveyListItem } from "../types/surveyList";
import { getQuestionTypeRoute } from "../utils/questionRoute";

interface UseSurveyNavigationState {
	surveyId?: string | null;
	survey?: SurveyListItem;
	questions?: TransformedSurveyQuestion[];
	currentQuestionIndex?: number;
	answers?: Record<number, string>;
}

interface UseSurveyNavigationOptions {
	questionType: TransformedSurveyQuestion["type"];
	validateAnswer?: (answer: string) => boolean;
}

export const useSurveyNavigation = ({
	questionType,
	validateAnswer,
}: UseSurveyNavigationOptions) => {
	const navigate = useNavigate();
	const location = useLocation();
	const locationState = location.state as UseSurveyNavigationState | undefined;

	const surveyId = useMemo(() => {
		const rawSurveyId = locationState?.surveyId ?? locationState?.survey?.id;
		return rawSurveyId ? Number(rawSurveyId) : null;
	}, [locationState?.survey?.id, locationState?.surveyId]);

	const allQuestions = locationState?.questions ?? [];
	const initialQuestionIndex = locationState?.currentQuestionIndex ?? 0;
	const initialAnswers = locationState?.answers ?? {};

	const [answers, setAnswers] =
		useState<Record<number, string>>(initialAnswers);
	const [submitting, setSubmitting] = useState(false);

	const currentQuestion = allQuestions[initialQuestionIndex];
	const isCurrentQuestionType =
		currentQuestion?.type === questionType ? currentQuestion : null;

	const totalQuestions = allQuestions.length;
	const progress =
		totalQuestions > 0 ? (initialQuestionIndex + 1) / totalQuestions : 0;

	const currentAnswer = isCurrentQuestionType
		? (answers[isCurrentQuestionType.questionId] ?? "")
		: "";

	const isInvalid = isCurrentQuestionType
		? (isCurrentQuestionType.isRequired ?? false) &&
			(validateAnswer
				? !validateAnswer(currentAnswer)
				: currentAnswer.trim().length === 0)
		: false;

	const updateAnswer = (questionId: number, value: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handlePrev = () => {
		if (initialQuestionIndex <= 0) {
			navigate(`/survey?surveyId=${surveyId}`, { replace: true });
			return;
		}

		const prevQuestion = allQuestions[initialQuestionIndex - 1];
		const prevRoute = getQuestionTypeRoute(prevQuestion.type);
		navigate(prevRoute, {
			state: {
				surveyId,
				questions: allQuestions,
				currentQuestionIndex: initialQuestionIndex - 1,
				answers,
			},
		});
	};

	const handleNext = async () => {
		if (!isCurrentQuestionType) {
			return;
		}

		// 답변 검증
		if (validateAnswer && !validateAnswer(currentAnswer)) {
			return;
		}

		// 다음 질문이 있는지 확인
		if (initialQuestionIndex < allQuestions.length - 1) {
			const nextQuestion = allQuestions[initialQuestionIndex + 1];
			const nextRoute = getQuestionTypeRoute(nextQuestion.type);
			navigate(nextRoute, {
				state: {
					surveyId,
					questions: allQuestions,
					currentQuestionIndex: initialQuestionIndex + 1,
					answers,
				},
			});
			return;
		}

		// 마지막 질문이면 제출
		if (!surveyId) {
			console.warn("surveyId가 없어 응답을 제출할 수 없습니다.");
			return;
		}

		try {
			setSubmitting(true);
			const payload = allQuestions.map((question) => ({
				questionId: question.questionId,
				content: answers[question.questionId] ?? "",
			}));
			console.log("설문 제출 시작:", { surveyId, payload });
			await submitSurveyParticipation(surveyId, payload);
			console.log("설문 제출 성공, complete 화면으로 이동");
			// 제출 성공 후 complete 화면으로 이동 (surveyId 전달)
			navigate("/survey/complete", {
				replace: true,
				state: { surveyId },
			});
		} catch (error) {
			console.error("설문 응답 제출 실패:", error);
			// 에러 발생 시에도 사용자에게 알림
			alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setSubmitting(false);
		}
	};

	return {
		surveyId,
		allQuestions,
		currentQuestion: isCurrentQuestionType,
		currentAnswer,
		answers,
		updateAnswer,
		progress,
		totalQuestions,
		currentQuestionIndex: initialQuestionIndex,
		isInvalid,
		submitting,
		handlePrev,
		handleNext,
	};
};
