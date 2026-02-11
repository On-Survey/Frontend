import { useSubmitScreeningResponse } from "@features/survey/hooks/useSubmitScreeningResponse";
import {
	getScreenings,
	getSurveyInfo,
	getSurveyParticipation,
} from "@features/survey/service/surveyParticipation";
import type { ScreeningQuestion } from "@features/survey/service/surveyParticipation/types";
import { formatRemainingTime } from "@shared/lib/FormatDate";
import { pushGtmEvent } from "@shared/lib/gtm";
import type { SurveyListItem } from "@shared/types/surveyList";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	Button,
	FixedBottomCTA,
	Text,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IneligibleSurveyBottomSheet } from "../components/IneligibleSurveyBottomSheet";

export const OxScreening = () => {
	const navigate = useNavigate();
	const [screeningQuestions, setScreeningQuestions] = useState<
		ScreeningQuestion[]
	>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [isIneligibleBottomSheetOpen, setIsIneligibleBottomSheetOpen] =
		useState(false);
	const [showNoQuiz, setShowNoQuiz] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [nextSurveyId, setNextSurveyId] = useState<number | null>(null);
	const [responseCount, setResponseCount] = useState<number | null>(null);

	const { mutateAsync: submitScreening } = useSubmitScreeningResponse();

	// 스크리닝 설문 조회
	useEffect(() => {
		const fetchScreenings = async () => {
			try {
				setIsLoading(true);
				const result = await getScreenings();
				if (result.data.length === 0) {
					setShowNoQuiz(true);
				} else {
					setScreeningQuestions(result.data);
					const firstSurveyId = result.data[0].surveyId;
					setNextSurveyId(firstSurveyId);
					// 첫 번째 설문의 responseCount 조회
					try {
						const surveyInfo = await getSurveyInfo(firstSurveyId);
						setResponseCount(surveyInfo.responseCount);
					} catch (err) {
						console.error("설문 정보 조회 실패:", err);
					}
				}
			} catch (err) {
				console.error("스크리닝 설문 조회 실패:", err);
				setShowNoQuiz(true);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchScreenings();
	}, []);

	const currentQuestion = screeningQuestions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === screeningQuestions.length - 1;

	const handleCloseModal = () => {
		setIsBottomSheetOpen(false);
		setSelectedOption(null);

		if (!isLastQuestion) {
			const nextIndex = currentQuestionIndex + 1;
			setCurrentQuestionIndex(nextIndex);
			if (screeningQuestions[nextIndex]) {
				const nextSurveyId = screeningQuestions[nextIndex].surveyId;
				setNextSurveyId(nextSurveyId);
				// 다음 설문의 responseCount 조회
				getSurveyInfo(nextSurveyId)
					.then((surveyInfo) => {
						setResponseCount(surveyInfo.responseCount);
					})
					.catch((err) => {
						console.error("설문 정보 조회 실패:", err);
					});
			}
		} else {
			setShowNoQuiz(true);
		}
	};

	const handleNextQuestion = async () => {
		if (currentQuestion && selectedOption !== null) {
			try {
				const content = String(selectedOption);
				await submitScreening({
					screeningId: currentQuestion.screeningId,
					payload: { content },
					surveyId: nextSurveyId,
				});
				pushGtmEvent({
					event: "complete_screening_quiz",
					pagePath: "/screening",
					quiz_id: String(currentQuestion.screeningId),
					result: "pass",
				});
			} catch (err) {
				console.error("스크리닝 응답 제출 실패:", err);
			}
		}

		setIsBottomSheetOpen(false);
		setSelectedOption(null);
		if (nextSurveyId) {
			try {
				// 설문 데이터를 미리 가져와서 SurveyListItem 형태로 변환
				const surveyData = await getSurveyParticipation({
					surveyId: nextSurveyId,
				});
				const remainingTimeText = surveyData.deadline
					? formatRemainingTime(surveyData.deadline)
					: undefined;
				const isClosed = remainingTimeText === "마감됨";

				const survey: SurveyListItem = {
					id: String(nextSurveyId),
					topicId: (surveyData.interests?.[0] ??
						"CAREER") as SurveyListItem["topicId"],
					title: surveyData.title,
					iconType: "icon",
					description: surveyData.description,
					remainingTimeText,
					isClosed,
				};

				pushGtmEvent({
					event: "survey_start",
					pagePath: "/survey",
					survey_id: String(nextSurveyId),
					source: "quiz",
					quiz_id: String(currentQuestion?.screeningId),
				});
				navigate(`/survey?surveyId=${nextSurveyId}`, {
					state: {
						surveyId: String(nextSurveyId),
						survey,
						source: "quiz" as const,
						quiz_id: String(currentQuestion?.screeningId),
					},
				});
			} catch (err) {
				console.error("설문 데이터 조회 실패:", err);
				// 실패하면 surveyId 전달

				navigate(`/survey?surveyId=${nextSurveyId}`, {
					state: {
						surveyId: String(nextSurveyId),
						source: "quiz" as const,
						quiz_id: String(currentQuestion?.screeningId),
					},
				});
			}
		} else {
			navigate("/survey");
		}
	};

	const handleOptionSelect = (answer: boolean) => {
		setSelectedOption(answer);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<Text color={adaptive.grey600} typography="t5">
					스크리닝 설문을 불러오는 중...
				</Text>
			</div>
		);
	}

	if (showNoQuiz || screeningQuestions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen ">
				<Asset.Image
					frameShape={Asset.frameShape.CleanW100}
					backgroundColor="transparent"
					src="https://static.toss.im/2d-emojis/png/4x/u1F622.png"
					aria-hidden={true}
					className="aspect-square mb-5"
				/>
				<Text
					display="block"
					color={adaptive.grey800}
					typography="st8"
					fontWeight="semibold"
					textAlign="center"
				>
					풀 수 있는 퀴즈가 없어요
				</Text>
				<div className="mt-5" />
			</div>
		);
	}

	if (!currentQuestion) {
		return null;
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center px-4 py-6 bg-white">
				<div className="mb-6">
					<Button size="small" color="dark" variant="weak">
						Q{currentQuestionIndex + 1}
					</Button>
				</div>

				<Text
					display="block"
					color={adaptive.grey900}
					typography="st5"
					fontWeight="semibold"
					textAlign="center"
					className="mb-6"
				>
					{currentQuestion.content}
				</Text>

				<div className="flex items-center justify-center gap-2 mt-8 mb-12">
					<Asset.Image
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						src="https://static.toss.im/2d-emojis/png/4x/u1F469_u1F3FB_u200D_u2764_u200D_u1F468_u1F3FB-big.png"
						aria-hidden={true}
						className="aspect-square"
					/>
					<Text
						color={adaptive.grey900}
						typography="t5"
						fontWeight="medium"
						textAlign="center"
					>
						{responseCount
							? `${responseCount.toLocaleString()}명이 퀴즈를 풀고 있어요`
							: "퀴즈를 풀고 있어요"}
					</Text>
				</div>

				{/* 있/없어요 버튼 */}
				<div className="flex flex-col gap-2 w-full">
					<div className="flex flex-start items-center gap-2">
						<button
							type="button"
							aria-label="예"
							onClick={() => handleOptionSelect(true)}
							className={`flex items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
								selectedOption === true
									? "bg-green-200"
									: "bg-green-100 hover:bg-green-200"
							}`}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-o-mono"
								color={adaptive.green500}
								aria-hidden={true}
								ratio="1/1"
							/>
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="medium"
								textAlign="center"
							>
								있어요
							</Text>
						</button>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="아니오"
							onClick={() => handleOptionSelect(false)}
							className={`flex items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
								selectedOption === false
									? "bg-red-200"
									: "bg-red-100 hover:bg-red-200"
							}`}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-x-mono"
								color={adaptive.red500}
								aria-hidden={true}
								ratio="1/1"
							/>
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="medium"
								textAlign="center"
							>
								없어요
							</Text>
						</button>
					</div>
				</div>
			</div>

			{/* 하단 버튼 */}
			<FixedBottomCTA
				loading={false}
				onClick={async () => {
					if (selectedOption === null || !currentQuestion) return;
					pushGtmEvent({
						event: "answer_screening_quiz",
						pagePath: "/screening",
						quiz_id: String(currentQuestion.screeningId),
					});

					if (selectedOption === currentQuestion.answer) {
						if (nextSurveyId) {
							pushGtmEvent({
								event: "unlock_survey",
								pagePath: "/screening",
								quiz_id: String(currentQuestion.screeningId),
								survey_id: String(nextSurveyId),
								source: "screening_quiz",
							});
						}
						setIsBottomSheetOpen(true);
					} else {
						// 정답이 아닐 때 바텀시트 표시
						setIsIneligibleBottomSheetOpen(true);
					}
				}}
				disabled={selectedOption === null}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				확인
			</FixedBottomCTA>

			{/* 바텀 시트 모달 */}
			<BottomSheet
				header={
					<BottomSheet.Header>
						{nextSurveyId ? "다음 설문에 참여해보세요" : "설문에 참여해보세요"}
					</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						{currentQuestion &&
							selectedOption !== null &&
							`${currentQuestion.content}에 ${selectedOption ? "있어요" : "없어요"}라고 답한 응답자들이 해당 설문에 참여했어요!`}
					</BottomSheet.HeaderDescription>
				}
				open={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button color="dark" variant="weak" onClick={handleCloseModal}>
								닫기
							</Button>
						}
						rightButton={
							<Button
								onClick={handleNextQuestion}
								style={
									{
										"--button-background-color": "#15c67f",
									} as React.CSSProperties
								}
							>
								다음
							</Button>
						}
					/>
				}
			>
				<div className="flex justify-center items-center">
					<Asset.Icon
						frameShape={{ width: 100 }}
						name="icon-equals-square-green"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>

			{/* 참여 불가 바텀시트 */}
			<IneligibleSurveyBottomSheet
				open={isIneligibleBottomSheetOpen}
				onClose={() => setIsIneligibleBottomSheetOpen(false)}
			/>
		</>
	);
};
