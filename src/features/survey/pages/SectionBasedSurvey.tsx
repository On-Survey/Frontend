import {
	getSurveyInfo,
	submitSurveyParticipation,
} from "@features/survey/service/surveyParticipation";
import { queryClient } from "@shared/contexts/queryClient";
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
import { useEffect, useState } from "react";
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
}

export const SectionBasedSurvey = () => {
	const navigate = useNavigate();
	const { numericSurveyId, locationState: routeState } = useSurveyRouteParams();
	const locationState = routeState as SectionBasedSurveyState | undefined;
	const surveyId = numericSurveyId ?? locationState?.surveyId ?? null;

	const [currentSection, setCurrentSection] = useState(
		locationState?.currentSection ?? 1,
	);

	const { data } = useSurveySectionQuestions(surveyId, currentSection);

	const questions = data?.info ?? [];
	const nextSectionFromApi = data?.nextSection;

	const isLastSection =
		nextSectionFromApi === undefined || nextSectionFromApi === 0;
	const sectionNext = nextSectionFromApi ?? currentSection + 1;

	const [answers, setAnswers] = useState<Record<number, string>>(
		locationState?.answers ?? {},
	);
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
		setSelectedDateQuestionId(questionId);
		const currentAnswer = answers[questionId];
		setDatePickerValue(currentAnswer ? new Date(currentAnswer) : new Date());
	};

	const handleDateChange = (date: Date) => {
		if (!selectedDateQuestionId) return;
		updateAnswer(selectedDateQuestionId, date.toISOString().split("T")[0]);
		setSelectedDateQuestionId(null);
	};

	const validateSection = () => {
		const errors = validateSectionAnswers(questions, answers);
		setQuestionErrors(errors);
		setExpandedQuestions((p) => {
			const next = { ...p };
			for (const id of Object.keys(errors)) {
				next[Number(id)] = true;
			}
			return next;
		});
		return Object.keys(errors).length === 0;
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
			// 이전 섹션으로 이동
			setCurrentSection(currentSection - 1);
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

		if (!validateSection()) {
			// 에러가 있는 경우 첫 번째 에러 문항으로 스크롤
			const firstErrorQuestionId = Object.keys(questionErrors)[0];
			if (firstErrorQuestionId) {
				const questionId = parseInt(firstErrorQuestionId, 10);
				const element = document.querySelector(
					`[data-question-id="${questionId}"]`,
				);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			return;
		}

		await submitCurrentSectionAnswers();

		const decidable = questions.find((q) => q.isSectionDecidable);
		const nextSection =
			decidable?.type === "multipleChoice" && answers[decidable.questionId]
				? (() => {
						const selected = answers[decidable.questionId]
							.split("|||")
							.filter(Boolean);
						const option = decidable.options?.find((o) =>
							selected.includes(o.content),
						);
						return option?.nextSection ?? sectionNext ?? currentSection + 1;
					})()
				: (sectionNext ?? currentSection + 1);

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
				queryClient.invalidateQueries();
			}
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

		if (!validateSection()) {
			const firstErrorQuestionId = Object.keys(questionErrors)[0];
			if (firstErrorQuestionId) {
				const questionId = parseInt(firstErrorQuestionId, 10);
				const element = document.querySelector(
					`[data-question-id="${questionId}"]`,
				);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
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

			{selectedDateQuestionId && (
				<WheelDatePicker
					title="날짜를 선택해 주세요"
					value={datePickerValue ?? new Date()}
					onChange={handleDateChange}
					triggerLabel="날짜"
					buttonText="선택하기"
				/>
			)}

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
