import { useToast } from "@toss/tds-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TransformedSurveyQuestion } from "../service/surveyParticipation";
import {
	completeSurvey,
	submitSurveyParticipation,
} from "../service/surveyParticipation";
import type { SurveyListItem } from "../types/surveyList";
import { pushGtmEvent } from "../utils/gtm";
import { getQuestionTypeRoute } from "../utils/questionRoute";

interface UseSurveyNavigationState {
	surveyId?: string | null;
	survey?: SurveyListItem;
	questions?: TransformedSurveyQuestion[];
	currentQuestionIndex?: number;
	answers?: Record<number, string>;
	source?: "main" | "quiz" | "after_complete";
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
	const { openToast } = useToast();
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

	const progressEventSentRef = useRef<string>("");

	useEffect(() => {
		if (!isCurrentQuestionType || !surveyId) return;

		// 같은 문항 인덱스에서는 한 번만 실행
		const eventKey = `${surveyId}-${initialQuestionIndex}`;
		if (progressEventSentRef.current === eventKey) return;

		progressEventSentRef.current = eventKey;

		// progress_percent 계산 (10, 30, 50, 70, 90 중 하나)
		const getProgressPercent = (index: number, total: number): number => {
			if (total === 0) return 0;
			if (total === 1) return 90;
			const ratio = (index + 1) / total;
			if (ratio <= 0.2) return 10;
			if (ratio <= 0.4) return 30;
			if (ratio <= 0.6) return 50;
			if (ratio <= 0.8) return 70;
			return 90;
		};

		const source = locationState?.source ?? "main";
		const progressPercent = getProgressPercent(
			initialQuestionIndex,
			totalQuestions,
		);

		pushGtmEvent({
			event: "survey_progress",
			pagePath: window.location.pathname,
			survey_id: String(surveyId),
			source,
			progress_percent: String(progressPercent),
		});
	}, [
		isCurrentQuestionType,
		surveyId,
		initialQuestionIndex,
		totalQuestions,
		locationState?.source,
	]);

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
				surveyId: String(surveyId),
				questions: allQuestions,
				currentQuestionIndex: initialQuestionIndex - 1,
				answers,
				source: locationState?.source,
			},
		});
	};

	const handleNext = async () => {
		if (!isCurrentQuestionType) {
			return;
		}

		if (validateAnswer && !validateAnswer(currentAnswer)) {
			return;
		}

		if (!surveyId) {
			console.warn("surveyId가 없어 응답을 제출할 수 없습니다.");
			return;
		}

		try {
			setSubmitting(true);
			const payload = [
				{
					questionId: isCurrentQuestionType.questionId,
					content: currentAnswer,
				},
			];
			await submitSurveyParticipation(surveyId, payload);

			const isLastQuestion = initialQuestionIndex >= allQuestions.length - 1;
			if (isLastQuestion) {
				await completeSurvey(surveyId);
				navigate("/survey/complete", {
					replace: true,
					state: {
						surveyId,
						source: locationState?.source,
					},
				});
				return;
			}

			const nextQuestion = allQuestions[initialQuestionIndex + 1];
			const nextRoute = getQuestionTypeRoute(nextQuestion.type);
			navigate(nextRoute, {
				state: {
					surveyId: String(surveyId),
					questions: allQuestions,
					currentQuestionIndex: initialQuestionIndex + 1,
					answers,
					source: locationState?.source,
				},
			});
		} catch (error) {
			console.error("설문 응답 제출 실패:", error);
			openToast("설문 제출을 실패했어요. 다시 시도해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
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
