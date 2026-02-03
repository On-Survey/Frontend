import { issuePromotion } from "@features/survey/service/promotion";
import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import {
	getSurveyInfo,
	sendSurveyHeartbeat,
	submitSurveyParticipation,
} from "@features/survey/service/surveyParticipation";
import { queryClient } from "@shared/contexts/queryClient";
import { pushGtmEvent } from "@shared/lib/gtm";
import { getQuestionTypeRoute } from "@shared/lib/questionRoute";
import type { SurveyListItem } from "@shared/types/surveyList";
import { useToast } from "@toss/tds-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompleteSurvey } from "./useCompleteSurvey";

interface UseSurveyNavigationState {
	surveyId?: string | null;
	survey?: SurveyListItem;
	questions?: TransformedSurveyQuestion[];
	currentQuestionIndex?: number;
	answers?: Record<number, string>;
	isFree?: boolean;
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
	const { mutateAsync: completeSurveyMutation } = useCompleteSurvey();

	const currentQuestion = allQuestions[initialQuestionIndex];
	const isCurrentQuestionType =
		currentQuestion?.type === questionType ? currentQuestion : null;

	const totalQuestions = allQuestions.length;
	const progress =
		totalQuestions > 0 ? (initialQuestionIndex + 1) / totalQuestions : 0;

	const progressEventSentRef = useRef<string>("");
	const lastInteractionTimeRef = useRef<number | null>(null);
	const hasInteractedRef = useRef<boolean>(false);

	// Heartbeat: 설문 진입 후 60초 안에 인터랙션이 있으면 true로 전송
	useEffect(() => {
		if (!isCurrentQuestionType || !surveyId) return;

		const handleUserInteraction = () => {
			hasInteractedRef.current = true;
			lastInteractionTimeRef.current = Date.now();
		};

		const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];
		events.forEach((event) => {
			window.addEventListener(event, handleUserInteraction, { passive: true });
		});

		const heartbeatInterval = setInterval(async () => {
			if (!hasInteractedRef.current || !lastInteractionTimeRef.current) {
				return;
			}

			const now = Date.now();
			const timeSinceLastInteraction = now - lastInteractionTimeRef.current;

			if (timeSinceLastInteraction <= 60000) {
				try {
					await sendSurveyHeartbeat(surveyId);
				} catch (error) {
					console.error("Heartbeat 전송 실패:", error);
				}
			}
		}, 60000);

		hasInteractedRef.current = false;
		lastInteractionTimeRef.current = null;

		return () => {
			clearInterval(heartbeatInterval);
			events.forEach((event) => {
				window.removeEventListener(event, handleUserInteraction);
			});
		};
	}, [isCurrentQuestionType, surveyId]);

	useEffect(() => {
		if (!isCurrentQuestionType || !surveyId) return;

		// 같은 문항 인덱스에서는 한 번만 실행
		const eventKey = `${surveyId}-${initialQuestionIndex}`;
		if (progressEventSentRef.current === eventKey) return;

		progressEventSentRef.current = eventKey;

		const source = locationState?.source ?? "main";

		pushGtmEvent({
			event: "survey_progress",
			pagePath: window.location.pathname,
			survey_id: String(surveyId),
			source,
		});
	}, [
		isCurrentQuestionType,
		surveyId,
		initialQuestionIndex,
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

		if (surveyId) {
			pushGtmEvent({
				event: "survey_progress_button_click",
				pagePath: window.location.pathname,
				survey_id: String(surveyId),
				source: locationState?.source ?? "main",
			});
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
				await completeSurveyMutation({ surveyId });

				// 프로모션 지급 첫 시도
				let promotionIssued: boolean | undefined;
				try {
					// 무료 설문 확인
					const surveyInfo = await getSurveyInfo(surveyId);
					const isSurveyFree = surveyInfo.isFree === true;

					if (!isSurveyFree) {
						// 유료 설문인 경우 프로모션 지급 시도
						try {
							await issuePromotion({ surveyId });
							// 쿼리 캐시 무효화
							queryClient.invalidateQueries({ queryKey: ["globalStats"] });
							queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] });
							queryClient.refetchQueries({ queryKey: ["recommendedSurveys"] });
							queryClient.refetchQueries({ queryKey: ["impendingSurveys"] });
							queryClient.refetchQueries({ queryKey: ["ongoingSurveysList"] });
							promotionIssued = true;
							console.log("프로모션 지급 성공 (제출 버튼에서 첫 시도)");
						} catch (error) {
							promotionIssued = false;
							console.error(
								"프로모션 지급 실패 (제출 버튼에서 첫 시도):",
								error,
							);
							// 실패해도 Complete 페이지로 이동 (재시도는 Complete에서)
						}
					} else {
						// 무료 설문인 경우 - 홈 설문 리스트 무효화
						queryClient.invalidateQueries({ queryKey: ["globalStats"] });
						queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] });
						queryClient.invalidateQueries({
							queryKey: ["recommendedSurveys"],
						});
						queryClient.invalidateQueries({
							queryKey: ["impendingSurveys"],
						});
						queryClient.invalidateQueries({
							queryKey: ["ongoingSurveysList"],
						});
						promotionIssued = true; // 지급 안 하므로 "성공" 처리
					}
				} catch (error) {
					console.error("설문 정보 조회 실패 또는 프로모션 지급 실패:", error);
					promotionIssued = false; // 에러 발생 시 재시도 필요
				}

				navigate("/survey/complete", {
					replace: true,
					state: {
						surveyId,
						isFree: locationState?.isFree,
						source: locationState?.source,
						promotionIssued, // 프로모션 지급 성공 여부 전달
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
					isFree: locationState?.isFree,
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
