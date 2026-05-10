import {
	getSurveyInfo,
	submitSurveyParticipation,
} from "@features/survey/service/surveyParticipation";
import { queryClient } from "@shared/contexts/queryClient";
import { formatDateToISO } from "@shared/lib/FormatDate";
import { pushGtmEvent } from "@shared/lib/gtm";
import { trackEvent } from "@shared/lib/mixpanel";
import { buildSectionAnswersPayload } from "@shared/lib/surveySubmission";
import { useToast } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateNextSection } from "../lib/calculateNextSection";
import { validateSectionAnswers } from "../lib/validateSectionAnswers";
import { issuePromotion } from "../service/promotion";
import { useCompleteSurvey } from "./useCompleteSurvey";
import { useSurveyRouteParams } from "./useSurveyRouteParams";
import { useSurveySectionQuestions } from "./useSurveySectionQuestions";

function isMultipleChoiceAnswerEmpty(raw: string | undefined): boolean {
	if (raw === undefined) return true;
	return raw.split("|||").filter(Boolean).length === 0;
}

export interface SectionBasedSurveyState {
	surveyId: number;
	currentSection: number;
	sectionCount?: number;
	answers: Record<number, string>;
	previousAnswers: Record<number, string>;
	surveyTitle?: string;
	surveyDescription?: string;
	source?: "main" | "quiz" | "after_complete";
	sectionHistory?: number[];
	price?: number;
}

export function useSectionBasedSurveyController() {
	const navigate = useNavigate();
	const { openToast } = useToast();
	const { numericSurveyId, locationState: routeState } = useSurveyRouteParams();
	const locationState = routeState as SectionBasedSurveyState | undefined;
	const surveyId = numericSurveyId ?? locationState?.surveyId ?? null;

	const [currentSection, setCurrentSection] = useState(
		locationState?.currentSection ?? 1,
	);

	const [sectionHistory, setSectionHistory] = useState<number[]>(
		locationState?.sectionHistory ?? [locationState?.currentSection ?? 1],
	);

	const { data, isError, isPending } = useSurveySectionQuestions(
		surveyId,
		currentSection,
	);

	const questions = data?.info ?? [];

	const sectionHeaderReady = surveyId === null || data !== undefined || isError;
	const headerTitleText = sectionHeaderReady
		? data?.sectionTitle?.trim() || locationState?.surveyTitle
		: undefined;
	const headerSubtitleText = sectionHeaderReady
		? data !== undefined
			? data.sectionDescription?.trim() || undefined
			: locationState?.surveyDescription
		: undefined;
	const nextSectionFromApi = data?.nextSection;

	const [answers, setAnswers] = useState<Record<number, string>>(
		locationState?.answers ?? {},
	);
	const answersRef = useRef<Record<number, string>>(
		locationState?.answers ?? {},
	);

	const actualNextSection = calculateNextSection(
		questions,
		answersRef.current,
		currentSection,
		nextSectionFromApi,
	);

	const decidableBranchQuestion = questions.find(
		(q) => q.isSectionDecidable && q.type === "multipleChoice",
	);
	const awaitingDecidableBranch =
		decidableBranchQuestion !== undefined &&
		isMultipleChoiceAnswerEmpty(
			answersRef.current[decidableBranchQuestion.questionId],
		);

	const isLastSection = actualNextSection === 0 && !awaitingDecidableBranch;

	const canSkipEmptySectionForward =
		questions.length === 0 &&
		!isLastSection &&
		actualNextSection > 0 &&
		actualNextSection !== currentSection;

	const [previousAnswers, setPreviousAnswers] = useState<
		Record<number, string>
	>(locationState?.previousAnswers ?? {});
	const [questionErrors, setQuestionErrors] = useState<
		Record<number, string | undefined>
	>({});
	const [expandedQuestions, setExpandedQuestions] = useState<
		Record<number, boolean>
	>({});

	const [selectedDateQuestionId, setSelectedDateQuestionId] = useState<
		number | null
	>(null);
	const [datePickerValue, setDatePickerValue] = useState<Date | null>(null);
	const datePickerContainerRef = useRef<HTMLDivElement | null>(null);
	const sectionActionInFlightRef = useRef(false);

	useEffect(() => {
		if (selectedDateQuestionId && datePickerContainerRef.current) {
			requestAnimationFrame(() => {
				const triggerButton = datePickerContainerRef.current?.querySelector(
					'button, [role="button"], input[type="button"]',
				) as HTMLElement;
				triggerButton?.click();
			});
		}
	}, [selectedDateQuestionId]);

	const [submitting, setSubmitting] = useState(false);
	const [nextLoading, setNextLoading] = useState(false);

	const { mutateAsync: completeSurveyMutation } = useCompleteSurvey();
	const [surveySectionCount, setSurveySectionCount] = useState<
		number | undefined
	>(locationState?.sectionCount);

	useEffect(() => {
		if (!surveyId || surveySectionCount != null) return;

		void (async () => {
			try {
				const info = await getSurveyInfo(surveyId);
				if (typeof info.totalSections === "number") {
					setSurveySectionCount(info.totalSections);
				}
			} catch {
				// 진행 바 표시를 위한 보조 정보이므로 조회 실패 시 무시
			}
		})();
	}, [surveyId, surveySectionCount]);

	useEffect(() => {
		if (!data?.info.length) return;
		const list = data.info;
		const expanded: Record<number, boolean> = {};
		list.forEach((q, idx) => {
			const prevIsImage = idx > 0 && list[idx - 1].type === "image";
			expanded[q.questionId] = idx === 0 || prevIsImage;
		});
		setExpandedQuestions(expanded);
	}, [data]);

	const updateAnswer = (questionId: number, value: string) => {
		const prev = answersRef.current[questionId];
		const nextAnswers = {
			...answersRef.current,
			[questionId]: value,
		};
		answersRef.current = nextAnswers;

		setAnswers(nextAnswers);

		if (prev && !value) {
			setPreviousAnswers((p) => ({ ...p, [questionId]: prev }));
		} else if (value) {
			setPreviousAnswers((p) => {
				const cp = { ...p };
				delete cp[questionId];
				return cp;
			});
		}

		if (questionErrors[questionId]) {
			setQuestionErrors((p) => {
				const cp = { ...p };
				delete cp[questionId];
				return cp;
			});
		}

		if (!prev && value) {
			const idx = questions.findIndex((q) => q.questionId === questionId);
			if (idx >= 0 && idx < questions.length - 1) {
				setExpandedQuestions((p) => ({
					...p,
					[questions[idx + 1].questionId]: true,
				}));
			}
		}
	};

	const handleToggleExpand = (questionId: number) => {
		setExpandedQuestions((p) => ({
			...p,
			[questionId]: !p[questionId],
		}));
	};

	const handleDatePickerOpen = (questionId: number) => {
		const currentAnswer = answers[questionId];
		setDatePickerValue(currentAnswer ? new Date(currentAnswer) : new Date());
		setSelectedDateQuestionId(questionId);
	};

	const handleDateChange = (date: Date) => {
		if (!selectedDateQuestionId) return;
		updateAnswer(selectedDateQuestionId, formatDateToISO(date));
		setSelectedDateQuestionId(null);
	};

	const validateSection = (): Record<number, string> => {
		const errors = validateSectionAnswers(questions, answersRef.current);
		setQuestionErrors(errors);
		setExpandedQuestions((p) => {
			const next = { ...p };
			for (const id of Object.keys(errors)) {
				next[Number(id)] = true;
			}
			return next;
		});
		return errors;
	};

	const scrollToFirstError = (errors: Record<number, string>) => {
		const firstErrorQuestionId = Object.keys(errors)[0];
		if (firstErrorQuestionId) {
			const questionId = parseInt(firstErrorQuestionId, 10);
			const element = document.querySelector(
				`[data-question-id="${questionId}"]`,
			);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	};

	const submitCurrentSectionAnswers = async () => {
		if (!surveyId) return;

		const infoList = buildSectionAnswersPayload({
			questions,
			answers: answersRef.current,
			previousAnswers,
		});

		if (infoList.length > 0) {
			await submitSurveyParticipation(surveyId, {
				section: currentSection,
				infoList,
			});
		}
	};

	/** 분기 경로 */
	const buildVisitedSectionsPayload = (): number[] => {
		const path: number[] = [];
		for (const s of sectionHistory) {
			if (path.length === 0 || path[path.length - 1] !== s) {
				path.push(s);
			}
		}
		if (path.length === 0 || path[path.length - 1] !== currentSection) {
			path.push(currentSection);
		}
		return path;
	};

	const clearAnswersForCurrentSection = () => {
		if (questions.length === 0) return;
		const ids = questions.map((q) => q.questionId);
		const nextAnswers = { ...answersRef.current };
		for (const id of ids) {
			delete nextAnswers[id];
		}
		answersRef.current = nextAnswers;
		setAnswers(nextAnswers);
		setPreviousAnswers((p) => {
			const cp = { ...p };
			for (const id of ids) {
				delete cp[id];
			}
			return cp;
		});
		setQuestionErrors((p) => {
			const cp = { ...p };
			for (const id of ids) {
				delete cp[id];
			}
			return cp;
		});
	};

	const handlePrev = () => {
		if (currentSection === 1) {
			navigate(`/survey?surveyId=${surveyId}`, {
				replace: true,
				state: { surveyId, price: locationState?.price },
			});
		} else {
			// 이전으로 가면서 떠나는 섹션의 로컬 응답을 제거해 분기 변경 시 응답이 섞이지 않게 함
			clearAnswersForCurrentSection();

			const currentIndex = sectionHistory.lastIndexOf(currentSection);
			let prevSection: number;
			let newHistory: number[];

			if (currentIndex > 0) {
				prevSection = sectionHistory[currentIndex - 1];
				newHistory = sectionHistory.slice(0, currentIndex);
			} else if (sectionHistory.length > 1) {
				newHistory = sectionHistory.slice(0, -1);
				prevSection = newHistory[newHistory.length - 1];
			} else {
				prevSection = currentSection - 1;
				newHistory = prevSection >= 1 ? [prevSection] : [1];
			}

			setCurrentSection(prevSection);
			setSectionHistory(newHistory);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleNext = async () => {
		if (!surveyId) return;
		if (sectionActionInFlightRef.current) return;
		if (isPending) return;
		if (questions.length === 0 && !canSkipEmptySectionForward) return;

		pushGtmEvent({
			event: "survey_progress_button_click",
			pagePath: "/survey",
			survey_id: String(surveyId),
			source: locationState?.source ?? "main",
		});

		trackEvent("Survey Started", {
			pagePath: "/survey",
			surveyId: String(surveyId),
			source: locationState?.source ?? "main",
		});

		const errors = validateSection();
		if (Object.keys(errors).length > 0) {
			scrollToFirstError(errors);
			return;
		}

		sectionActionInFlightRef.current = true;
		setNextLoading(true);
		try {
			await submitCurrentSectionAnswers();

			const nextSection = calculateNextSection(
				questions,
				answersRef.current,
				currentSection,
				nextSectionFromApi,
			);

			setSectionHistory((prev) => {
				if (prev.length === 0 || prev[prev.length - 1] !== currentSection) {
					return [...prev, currentSection, nextSection];
				}
				return [...prev, nextSection];
			});

			setCurrentSection(nextSection);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			console.error("설문 응답 저장 실패:", error);
			openToast("설문 제출을 실패했어요 다시 시도해주세요", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
		} finally {
			sectionActionInFlightRef.current = false;
			setNextLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!surveyId) return;

		const visitedSections = buildVisitedSectionsPayload();

		await completeSurveyMutation({ surveyId, visitedSections });

		let surveyInfo: Awaited<ReturnType<typeof getSurveyInfo>> | undefined;
		try {
			surveyInfo = await getSurveyInfo(surveyId);
			if (!surveyInfo.isFree) {
				await issuePromotion({ surveyId });
			}
			queryClient.invalidateQueries({ queryKey: ["allOngoingSurveys"] });
		} catch {
			// 실패해도 완료 페이지 이동
		}

		navigate("/survey/complete", {
			state: {
				surveyId: String(surveyId),
				source: locationState?.source,
				price: surveyInfo?.price,
			},
		});
	};

	const handleSubmitClick = async () => {
		if (sectionActionInFlightRef.current) return;
		if (isPending) return;
		if (questions.length === 0 && !isLastSection) return;

		if (surveyId) {
			pushGtmEvent({
				event: "survey_progress_button_click",
				pagePath: "/survey",
				survey_id: String(surveyId),
				source: locationState?.source ?? "main",
			});
		}

		const errors = validateSection();
		if (Object.keys(errors).length > 0) {
			scrollToFirstError(errors);
			return;
		}

		sectionActionInFlightRef.current = true;
		setSubmitting(true);
		try {
			await submitCurrentSectionAnswers();
			await handleSubmit();
		} catch (error) {
			console.error("설문 제출 실패:", error);
			openToast("설문 제출을 실패했어요. 다시 시도해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
		} finally {
			sectionActionInFlightRef.current = false;
			setSubmitting(false);
		}
	};

	return {
		headerTitleText,
		headerSubtitleText,
		currentSection,
		sectionCount: surveySectionCount,
		progress:
			typeof surveySectionCount === "number" && surveySectionCount > 0
				? Math.min(currentSection / surveySectionCount, 1)
				: 0,
		canSkipEmptySectionForward,
		questions,
		answers,
		updateAnswer,
		questionErrors,
		expandedQuestions,
		handleToggleExpand,
		handleDatePickerOpen,
		handleDateChange,
		datePickerContainerRef,
		datePickerValue,
		handlePrev,
		handleNext,
		handleSubmitClick,
		isLastSection,
		isBeforeSubmitStep: isLastSection,
		submitting,
		nextLoading,
		isPending,
	};
}
