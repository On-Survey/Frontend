import {
	getSurveyInfo,
	submitSurveyParticipation,
	type TransformedSurveyQuestion,
} from "@features/survey/service/surveyParticipation";
import { queryClient } from "@shared/contexts/queryClient";
import { formatDateToISO } from "@shared/lib/FormatDate";
import { pushGtmEvent } from "@shared/lib/gtm";
import { buildSectionAnswersPayload } from "@shared/lib/surveySubmission";
import { adaptive } from "@toss/tds-colors";
import {
	Border,
	CTAButton,
	FixedBottomCTA,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteSurvey } from "../hooks/useCompleteSurvey";
import { useSurveyRouteParams } from "../hooks/useSurveyRouteParams";
import { useSurveySectionQuestions } from "../hooks/useSurveySectionQuestions";
import { validateSectionAnswers } from "../lib/validateSectionAnswers";
import { issuePromotion } from "../service/promotion";
import { QuestionRenderer } from "./components/QuestionRenderer";

interface SectionBasedSurveyState {
	surveyId: number;
	currentSection: number;
	answers: Record<number, string>;
	previousAnswers: Record<number, string>;
	surveyTitle?: string;
	surveyDescription?: string;
	source?: "main" | "quiz" | "after_complete";
	sectionHistory?: number[];
}

export const SectionBasedSurvey = () => {
	const navigate = useNavigate();
	const { numericSurveyId, locationState: routeState } = useSurveyRouteParams();
	const locationState = routeState as SectionBasedSurveyState | undefined;
	const surveyId = numericSurveyId ?? locationState?.surveyId ?? null;

	const [currentSection, setCurrentSection] = useState(
		locationState?.currentSection ?? 1,
	);

	// 섹션 이동 경로 추적
	const [sectionHistory, setSectionHistory] = useState<number[]>(
		locationState?.sectionHistory ?? [locationState?.currentSection ?? 1],
	);

	const { data } = useSurveySectionQuestions(surveyId, currentSection);

	const questions = data?.info ?? [];
	const nextSectionFromApi = data?.nextSection;

	const [answers, setAnswers] = useState<Record<number, string>>(
		locationState?.answers ?? {},
	);

	// 다음 섹션 계산 함수
	const calculateNextSection = (
		questions: TransformedSurveyQuestion[],
		answers: Record<number, string>,
		currentSection: number,
		nextSectionFromApi?: number,
	): number => {
		const decidableQuestion = questions.find(
			(q: TransformedSurveyQuestion) => q.isSectionDecidable,
		);
		const hasDecidableAnswer =
			decidableQuestion !== undefined &&
			decidableQuestion.type === "multipleChoice" &&
			answers[decidableQuestion.questionId] !== undefined;

		if (hasDecidableAnswer && decidableQuestion) {
			const answerValue = answers[decidableQuestion.questionId];
			if (answerValue) {
				const selected = answerValue.split("|||").filter(Boolean);
				// 다중 선택의 경우, nextSection이 있는 첫 번째 옵션을 찾음
				const option = decidableQuestion.options?.find(
					(o) => selected.includes(o.content) && o.nextSection !== undefined,
				);
				if (option?.nextSection !== undefined) {
					return option.nextSection;
				}
			}
		}

		return nextSectionFromApi ?? currentSection + 1;
	};

	// 현재 상태에서 다음 섹션 계산
	const actualNextSection = calculateNextSection(
		questions,
		answers,
		currentSection,
		nextSectionFromApi,
	);

	// 실제 다음 섹션이 0이면 마지막 섹션
	const isLastSection = actualNextSection === 0;
	const [previousAnswers, setPreviousAnswers] = useState<
		Record<number, string>
	>(locationState?.previousAnswers ?? {});
	const [questionErrors, setQuestionErrors] = useState<
		Record<number, string | undefined>
	>({});
	const [expandedQuestions, setExpandedQuestions] = useState<
		Record<number, boolean>
	>({});

	// 날짜 선택 관련 상태
	const [selectedDateQuestionId, setSelectedDateQuestionId] = useState<
		number | null
	>(null);
	const [datePickerValue, setDatePickerValue] = useState<Date | null>(null);
	const datePickerContainerRef = useRef<HTMLDivElement | null>(null);

	// WheelDatePicker 트리거 자동 클릭
	useEffect(() => {
		if (selectedDateQuestionId && datePickerContainerRef.current) {
			// 다음 렌더 사이클에서 트리거 버튼 클릭
			requestAnimationFrame(() => {
				const triggerButton = datePickerContainerRef.current?.querySelector(
					'button, [role="button"], input[type="button"]',
				) as HTMLElement;
				triggerButton?.click();
			});
		}
	}, [selectedDateQuestionId]);

	const [submitting, setSubmitting] = useState(false);

	const { mutateAsync: completeSurveyMutation } = useCompleteSurvey();

	useEffect(() => {
		if (!data?.info.length) return;
		const expanded: Record<number, boolean> = {};
		data.info.forEach((q, idx) => {
			expanded[q.questionId] = idx === 0;
		});
		setExpandedQuestions(expanded);
	}, [data]);

	const updateAnswer = (questionId: number, value: string) => {
		const prev = answers[questionId];

		setAnswers((p) => ({ ...p, [questionId]: value }));

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
		const errors = validateSectionAnswers(questions, answers);
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

		const payload = buildSectionAnswersPayload({
			questions,
			answers,
			previousAnswers,
		});

		if (payload.length > 0) {
			await submitSurveyParticipation(surveyId, payload);
		}
	};

	const handlePrev = () => {
		if (currentSection === 1) {
			// 첫 섹션인 경우 Survey 페이지로 이동
			navigate(`/survey?surveyId=${surveyId}`, { replace: true });
		} else {
			const currentIndex = sectionHistory.indexOf(currentSection);
			let prevSection: number;
			let newHistory: number[];

			if (currentIndex > 0) {
				// 경로에 현재 섹션이 있고 이전 섹션이 있으면
				prevSection = sectionHistory[currentIndex - 1];
				// 경로에서 현재 섹션 이후 제거
				newHistory = sectionHistory.slice(0, currentIndex);
			} else if (sectionHistory.length > 1) {
				// 경로에 현재 섹션이 없지만 경로가 있으면 마지막에서 하나 제거
				newHistory = sectionHistory.slice(0, -1);
				prevSection = newHistory[newHistory.length - 1];
			} else {
				// 경로가 없거나 하나만 있으면 단순히 -1
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

		pushGtmEvent({
			event: "survey_progress_button_click",
			pagePath: "/survey",
			survey_id: String(surveyId),
			source: locationState?.source ?? "main",
		});

		const errors = validateSection();
		if (Object.keys(errors).length > 0) {
			scrollToFirstError(errors);
			return;
		}

		await submitCurrentSectionAnswers();

		const nextSection = calculateNextSection(
			questions,
			answers,
			currentSection,
			nextSectionFromApi,
		);

		// 섹션 이동 경로에 다음 섹션 추가
		setSectionHistory((prev) => {
			if (prev.length === 0 || prev[prev.length - 1] !== currentSection) {
				return [...prev, currentSection, nextSection];
			}
			return [...prev, nextSection];
		});

		setCurrentSection(nextSection);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async () => {
		if (!surveyId) return;

		setSubmitting(true);
		await completeSurveyMutation({ surveyId });

		try {
			const surveyInfo = await getSurveyInfo(surveyId);
			if (!surveyInfo.isFree) {
				await issuePromotion({ surveyId });
			}
			// 무료/유료 구분 없이 홈 설문 리스트 갱신
			queryClient.invalidateQueries({ queryKey: ["allOngoingSurveys"] });
		} catch {
			// 실패해도 완료 페이지 이동
		}

		navigate("/survey/complete", {
			state: {
				surveyId: String(surveyId),
				source: locationState?.source,
			},
		});
	};
	const handleSubmitClick = async () => {
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

		await submitCurrentSectionAnswers();
		await handleSubmit();
	};

	if (questions.length === 0) return null;

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{locationState?.surveyTitle}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					locationState?.surveyDescription ? (
						<Top.SubtitleParagraph size={15}>
							{locationState.surveyDescription}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>
			<Border variant="height16" />

			<div className="pb-14">
				{questions.map((q) => (
					<div key={q.questionId} data-question-id={q.questionId}>
						<QuestionRenderer
							question={q}
							answer={answers[q.questionId]}
							onAnswerChange={updateAnswer}
							error={!!questionErrors[q.questionId]}
							errorMessage={questionErrors[q.questionId]}
							isExpanded={expandedQuestions[q.questionId]}
							onToggleExpand={() => handleToggleExpand(q.questionId)}
							onDatePickerOpen={() => handleDatePickerOpen(q.questionId)}
						/>
					</div>
				))}
			</div>

			<div
				ref={datePickerContainerRef}
				style={{
					position: "absolute",
					left: "-9999px",
					opacity: 0,
					pointerEvents: "none",
				}}
			>
				<WheelDatePicker
					title="날짜를 선택해 주세요"
					value={datePickerValue ?? new Date()}
					onChange={handleDateChange}
					triggerLabel="날짜"
					buttonText="선택하기"
				/>
			</div>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton variant="weak" onClick={handlePrev}>
						이전
					</CTAButton>
				}
				rightButton={
					isLastSection ? (
						<CTAButton loading={submitting} onClick={handleSubmitClick}>
							제출
						</CTAButton>
					) : (
						<CTAButton onClick={handleNext}>다음</CTAButton>
					)
				}
			/>
		</>
	);
};
