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
import { queryClient } from "../../contexts/queryClient";
import { useCompleteSurvey } from "../../hooks/useCompleteSurvey";
import { issuePromotion } from "../../service/promotion";
import type { TransformedSurveyQuestion } from "../../service/surveyParticipation";
import {
	getSurveyInfo,
	getSurveyQuestions,
	submitSurveyParticipation,
} from "../../service/surveyParticipation";
import { buildSectionAnswersPayload } from "../../utils/surveySubmission";
import { QuestionRenderer } from "./components/QuestionRenderer";

interface SectionBasedSurveyState {
	surveyId: number;
	currentSection: number; // 현재 섹션 번호 (시작은 1)
	answers: Record<number, string>;
	previousAnswers: Record<number, string>; // 이전에 답변했다가 해제한 경우 추적
	surveyTitle?: string; // 설문 전체 제목
	surveyDescription?: string; // 설문 전체 설명
	source?: "main" | "quiz" | "after_complete";
}

export const SectionBasedSurvey = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const locationState = location.state as SectionBasedSurveyState | undefined;

	const surveyId = locationState?.surveyId ?? null;
	const initialSection = locationState?.currentSection ?? 1;
	const initialAnswers = locationState?.answers ?? {};
	const initialPreviousAnswers = locationState?.previousAnswers ?? {};
	const initialSurveyTitle = locationState?.surveyTitle ?? "";
	const initialSurveyDescription = locationState?.surveyDescription ?? "";

	const [currentSection, setCurrentSection] = useState(initialSection);
	const [questions, setQuestions] = useState<TransformedSurveyQuestion[]>([]);
	const [surveyTitle] = useState<string>(initialSurveyTitle);
	const [surveyDescription] = useState<string>(initialSurveyDescription);
	const [answers, setAnswers] =
		useState<Record<number, string>>(initialAnswers);
	const [previousAnswers, setPreviousAnswers] = useState<
		Record<number, string>
	>(initialPreviousAnswers);
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
	const [submitting, setSubmitting] = useState(false);
	const [isLastSection, setIsLastSection] = useState(false);

	const { mutateAsync: completeSurveyMutation } = useCompleteSurvey();

	// 섹션별 문항 조회 및 다음 섹션 확인
	useEffect(() => {
		if (!surveyId) return;

		const fetchSectionQuestions = async () => {
			try {
				const result = await getSurveyQuestions({
					surveyId,
					section: currentSection,
				});

				if (result.info.length === 0) {
					return;
				}

				setQuestions(result.info);

				// 1번 문항만 열림, 나머지는 닫힘 상태로 초기화
				const expanded: Record<number, boolean> = {};
				result.info.forEach((q, index) => {
					expanded[q.questionId] = index === 0; // 첫 번째 문항만 true
				});
				setExpandedQuestions(expanded);

				// 다음 섹션 확인 (분기처리 문항이 있는 경우 고려)
				const sectionDecidableQuestion = result.info.find(
					(q) => q.type === "multipleChoice" && q.isSectionDecidable,
				);

				let nextSectionToCheck: number | null = null;

				if (sectionDecidableQuestion) {
					// 분기처리 문항이 있는 경우, 선택된 답변의 nextSection 확인
					const answer = answers[sectionDecidableQuestion.questionId];
					if (answer) {
						const selectedOptions = answer.split("|||").filter(Boolean);
						const option = sectionDecidableQuestion.options?.find((opt) =>
							selectedOptions.includes(opt.content),
						);
						if (option?.nextSection !== undefined && option.nextSection !== 0) {
							nextSectionToCheck = option.nextSection;
						}
					}
				}

				// 분기처리가 없거나 결과가 없는 경우 다음 섹션 확인
				if (nextSectionToCheck === null) {
					nextSectionToCheck = currentSection + 1;
				}

				// 다음 섹션 문항 조회하여 마지막 섹션인지 확인
				try {
					const nextResult = await getSurveyQuestions({
						surveyId,
						section: nextSectionToCheck,
					});
					setIsLastSection(nextResult.info.length === 0);
				} catch {
					// 다음 섹션 조회 실패 시 마지막 섹션으로 간주하지 않음
					setIsLastSection(false);
				}
			} catch (error) {
				console.error("섹션 문항 조회 실패:", error);
			}
		};

		fetchSectionQuestions();
	}, [surveyId, currentSection, answers]);

	const updateAnswer = (questionId: number, value: string) => {
		const previousValue = answers[questionId];
		const wasEmpty = !previousValue || previousValue.trim().length === 0;
		const isNowFilled = value && value.trim().length > 0;

		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));

		// 이전에 답변이 있었다가 해제한 경우 추적
		if (previousValue && !value) {
			setPreviousAnswers((prev) => ({
				...prev,
				[questionId]: previousValue,
			}));
		} else if (value) {
			// 다시 답변한 경우 previousAnswers에서 제거
			setPreviousAnswers((prev) => {
				const newPrev = { ...prev };
				delete newPrev[questionId];
				return newPrev;
			});
		}

		// 답변 변경 시 에러 제거
		if (questionErrors[questionId]) {
			setQuestionErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[questionId];
				return newErrors;
			});
		}

		// 직전 문항 완료 시 다음 문항 열림
		if (wasEmpty && isNowFilled) {
			const currentQuestionIndex = questions.findIndex(
				(q) => q.questionId === questionId,
			);
			if (
				currentQuestionIndex >= 0 &&
				currentQuestionIndex < questions.length - 1
			) {
				const nextQuestion = questions[currentQuestionIndex + 1];
				if (nextQuestion) {
					setExpandedQuestions((prev) => ({
						...prev,
						[nextQuestion.questionId]: true,
					}));
				}
			}
		}
	};

	const validateSection = (): boolean => {
		if (questions.length === 0) return false;

		const errors: Record<number, string | undefined> = {};

		questions.forEach((question) => {
			const answer = answers[question.questionId];
			const isEmpty = !answer || answer.trim().length === 0;

			// 필수 문항 검사
			if (question.isRequired && isEmpty) {
				errors[question.questionId] = "해당 문항을 완료해주세요";
				return;
			}

			// 객관식 문항 최대 선택 개수 검사
			if (question.type === "multipleChoice" && answer) {
				const selectedCount = answer.split("|||").filter(Boolean).length;
				if (question.maxChoice && selectedCount > question.maxChoice) {
					errors[question.questionId] = "해당 문항을 완료해주세요";
					return;
				}
			}
		});

		setQuestionErrors(errors);

		// 에러가 있는 문항들을 expanded 상태로 변경
		const newExpanded = { ...expandedQuestions };
		Object.keys(errors).forEach((questionIdStr) => {
			const questionId = parseInt(questionIdStr, 10);
			newExpanded[questionId] = true;
		});
		setExpandedQuestions(newExpanded);

		return Object.keys(errors).length === 0;
	};

	const handlePrev = () => {
		if (currentSection === 1) {
			// 첫 섹션인 경우 Survey 페이지로 이동
			navigate(`/survey?surveyId=${surveyId}`, { replace: true });
		} else {
			// 이전 섹션으로 이동
			setCurrentSection(currentSection - 1);
			// 스크롤을 맨 위로
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleNext = async () => {
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

		// 현재 섹션의 답변 제출
		await submitCurrentSectionAnswers();

		// 분기처리 로직: 객관식 문항 중 isSectionDecidable이 true인 경우
		const sectionDecidableQuestion = questions.find(
			(q) => q.type === "multipleChoice" && q.isSectionDecidable,
		);

		let nextSection: number | null = null;

		if (sectionDecidableQuestion) {
			// 분기처리 문항이 있는 경우
			const answer = answers[sectionDecidableQuestion.questionId];
			if (answer) {
				// 선택한 보기의 nextSection 값 확인
				const selectedOptions = answer.split("|||").filter(Boolean);
				const option = sectionDecidableQuestion.options?.find((opt) =>
					selectedOptions.includes(opt.content),
				);

				if (option?.nextSection !== undefined) {
					if (option.nextSection === 0) {
						// nextSection = 0이면 설문 종료
						await handleSubmit();
						return;
					} else {
						nextSection = option.nextSection;
					}
				}
			}
		}

		// 분기처리가 없거나 분기처리 결과가 없는 경우 다음 섹션으로 (기본값: 현재 section + 1)
		if (nextSection === null) {
			nextSection = currentSection + 1;
		}

		// 다음 섹션 문항 조회
		if (!surveyId) {
			console.error("surveyId가 없습니다.");
			return;
		}

		try {
			const result = await getSurveyQuestions({
				surveyId,
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

	// 현재 섹션의 답변 제출
	const submitCurrentSectionAnswers = async () => {
		if (!surveyId) return;

		const payload = buildSectionAnswersPayload({
			questions,
			answers,
			previousAnswers,
		});

		if (payload.length > 0) {
			try {
				await submitSurveyParticipation(surveyId, payload);
			} catch (error) {
				console.error("섹션 답변 제출 실패:", error);
			}
		}
	};

	const handleSubmit = async () => {
		if (!surveyId) {
			console.error("surveyId가 없습니다.");
			return;
		}

		// 현재 섹션 답변 제출
		await submitCurrentSectionAnswers();

		try {
			setSubmitting(true);
			await completeSurveyMutation({ surveyId });

			// 프로모션 지급 (구글폼 설문은 필수적으로 지급)
			let promotionIssued: boolean | undefined;
			try {
				// 설문 정보 확인
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
						console.log("프로모션 지급 성공");
					} catch (error) {
						promotionIssued = false;
						console.error("프로모션 지급 실패:", error);
						// 실패해도 Complete 페이지로 이동 (재시도는 Complete에서)
					}
				} else {
					// 무료 설문인 경우
					promotionIssued = true; // 지급 안 하므로 "성공" 처리
				}
			} catch (error) {
				console.error("설문 정보 조회 실패 또는 프로모션 지급 실패:", error);
				promotionIssued = false; // 에러 발생 시 재시도 필요
			}

			// 완료 페이지로 이동
			navigate("/survey/complete", {
				state: {
					surveyId: String(surveyId),
					source: locationState?.source,
					promotionIssued, // 프로모션 지급 성공 여부 전달
				},
			});
		} catch (error) {
			console.error("설문 제출 실패:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDatePickerOpen = (questionId: number) => {
		setSelectedDateQuestionId(questionId);
		const currentAnswer = answers[questionId];
		if (currentAnswer) {
			setDatePickerValue(new Date(currentAnswer));
		} else {
			setDatePickerValue(new Date());
		}
	};

	const handleDateChange = (date: Date) => {
		if (selectedDateQuestionId) {
			const formattedDate = date.toISOString().split("T")[0];
			updateAnswer(selectedDateQuestionId, formattedDate);
			setSelectedDateQuestionId(null);
		}
	};

	if (questions.length === 0) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{surveyTitle}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					surveyDescription ? (
						<Top.SubtitleParagraph size={15}>
							{surveyDescription}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>
			<Border variant="height16" />

			<div className="px-4 pb-28">
				{questions.map((question) => (
					<div key={question.questionId} data-question-id={question.questionId}>
						<QuestionRenderer
							question={question}
							answer={answers[question.questionId]}
							onAnswerChange={updateAnswer}
							error={!!questionErrors[question.questionId]}
							errorMessage={questionErrors[question.questionId]}
							onDatePickerOpen={() => handleDatePickerOpen(question.questionId)}
							isExpanded={expandedQuestions[question.questionId] ?? false}
							onToggleExpand={() => {
								setExpandedQuestions((prev) => ({
									...prev,
									[question.questionId]: !(prev[question.questionId] ?? true),
								}));
							}}
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
					<CTAButton
						color="dark"
						variant="weak"
						display="block"
						onClick={handlePrev}
					>
						이전
					</CTAButton>
				}
				rightButton={
					<CTAButton
						display="block"
						disabled={submitting}
						loading={submitting}
						onClick={handleNext}
						style={
							{
								"--button-background-color": "#15c67f",
							} as React.CSSProperties
						}
					>
						{isLastSection ? "제출" : "다음"}
					</CTAButton>
				}
			/>
		</>
	);
};
