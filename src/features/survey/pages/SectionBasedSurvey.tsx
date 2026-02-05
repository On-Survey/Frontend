import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import {
	getSurveyInfo,
	getSurveyQuestions,
	submitSurveyParticipation,
} from "@features/survey/service/surveyParticipation";
import * as Sentry from "@sentry/react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useCompleteSurvey } from "../hooks/useCompleteSurvey";
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
	const location = useLocation();
	const locationState = location.state as SectionBasedSurveyState | undefined;

	const surveyId = locationState?.surveyId ?? null;

	const [currentSection, setCurrentSection] = useState(
		locationState?.currentSection ?? 1,
	);
	const [questions, setQuestions] = useState<TransformedSurveyQuestion[]>([]);
	const [sectionNext, setSectionNext] = useState<number>(0);

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

	/* ======================
     섹션 문항 조회
  ====================== */
	useEffect(() => {
		if (!surveyId) return;

		const fetchQuestions = async () => {
			try {
				const result = await getSurveyQuestions({
					surveyId,
					section: currentSection,
				});

				setQuestions(result.info);
				// nextSection이 없으면 기본값: 현재 섹션 + 1
				setSectionNext(result.nextSection ?? currentSection + 1);

				const expanded: Record<number, boolean> = {};
				result.info.forEach((q, idx) => {
					expanded[q.questionId] = idx === 0;
				});
				setExpandedQuestions(expanded);
			} catch (e) {
				Sentry.captureException(e);
			}
		};

		fetchQuestions();
	}, [surveyId, currentSection]);

	/* ======================
     답변 업데이트
  ====================== */
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

	/* ======================
     토글 핸들러
  ====================== */
	const handleToggleExpand = (questionId: number) => {
		setExpandedQuestions((p) => ({
			...p,
			[questionId]: !p[questionId],
		}));
	};

	/* ======================
     날짜 Picker 핸들러
  ====================== */
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

	/* ======================
     섹션 검증
  ====================== */
	const validateSection = () => {
		const errors: Record<number, string> = {};

		questions.forEach((q) => {
			const a = answers[q.questionId];
			if (q.isRequired && (!a || !a.trim())) {
				errors[q.questionId] = "해당 문항을 완료해주세요";
			}
		});

		setQuestionErrors(errors);

		setExpandedQuestions((p) => {
			const cp = { ...p };
			Object.keys(errors).forEach((id) => {
				cp[Number(id)] = true;
			});
			return cp;
		});

		return Object.keys(errors).length === 0;
	};

	/* ======================
     섹션 답변 제출
  ====================== */
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

	/* ======================
     이전 버튼
  ====================== */
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

	/* ======================
     다음 버튼
  ====================== */
	const handleNext = async () => {
		if (surveyId) {
			pushGtmEvent({
				event: "survey_progress_button_click",
				pagePath: "/survey",
				survey_id: String(surveyId),
				source: locationState?.source ?? "main",
			});
		}

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

		// 섹션 분기 로직:
		// 1. 섹션 내에 isSectionDecidable=true인 문항이 있는지 확인
		// 2. 있으면 → 선택한 보기의 nextSection 사용 (첫 번째 선택한 보기 기준)
		// 3. 없으면 → 섹션의 nextSection 사용 (기본값: currentSection + 1)
		// 4. nextSection === 0 → 설문 종료
		const decidable = questions.find((q) => q.isSectionDecidable);

		let nextSection: number;

		if (decidable && decidable.type === "multipleChoice") {
			const answer = answers[decidable.questionId];
			if (answer) {
				const selected = answer.split("|||").filter(Boolean);
				const selectedOption = decidable.options?.find((o) =>
					selected.includes(o.content),
				);
				if (selectedOption?.nextSection !== undefined) {
					nextSection = selectedOption.nextSection;
				} else {
					nextSection = currentSection + 1;
				}
			} else {
				nextSection = sectionNext ?? currentSection + 1;
			}
		} else {
			nextSection = sectionNext ?? currentSection + 1;
		}

		if (nextSection === 0) {
			await handleSubmit();
			return;
		}

		// 다음 섹션 문항 조회
		try {
			const result = await getSurveyQuestions({
				surveyId: surveyId!,
				section: nextSection,
			});

			if (result.info.length === 0) {
				// 문항이 없으면 제출 완료
				await handleSubmit();
				return;
			}

			// 다음 섹션으로 이동
			setCurrentSection(nextSection);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			console.error("다음 섹션 조회 실패:", error);
		}
	};

	/* ======================
     최종 제출
  ====================== */
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
					<CTAButton loading={submitting} onClick={handleNext}>
						{sectionNext === 0 ? "제출" : "다음"}
					</CTAButton>
				}
			/>
		</>
	);
};
