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
import { getScreenings } from "../service/surveyParticipation";
import type { ScreeningQuestion } from "../service/surveyParticipation/types";

export const OxScreening = () => {
	const navigate = useNavigate();
	const [screeningQuestions, setScreeningQuestions] = useState<
		ScreeningQuestion[]
	>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [showNoQuiz, setShowNoQuiz] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [nextSurveyId, setNextSurveyId] = useState<number | null>(null);

	// 스크리닝 설문 조회
	useEffect(() => {
		const fetchScreenings = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await getScreenings();
				if (result.data.length === 0) {
					setShowNoQuiz(true);
				} else {
					setScreeningQuestions(result.data);
					// 다음 설문 ID 설정 (현재 질문의 surveyId)
					if (result.data.length > 0) {
						setNextSurveyId(result.data[0].surveyId);
					}
				}
			} catch (err) {
				console.error("스크리닝 설문 조회 실패:", err);
				setError("스크리닝 설문을 불러오지 못했습니다.");
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
			// 다음 질문의 surveyId로 업데이트
			if (screeningQuestions[nextIndex]) {
				setNextSurveyId(screeningQuestions[nextIndex].surveyId);
			}
		} else {
			setShowNoQuiz(true);
		}
	};

	const handleNextQuestion = () => {
		setIsBottomSheetOpen(false);
		setSelectedOption(null);
		// 다음 설문으로 이동
		if (nextSurveyId) {
			navigate(`/survey?surveyId=${nextSurveyId}`, {
				state: { surveyId: String(nextSurveyId) },
			});
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

	if (error || showNoQuiz || screeningQuestions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen ">
				<Asset.Image
					frameShape={Asset.frameShape.CleanW100}
					backgroundColor="transparent"
					src="https://static.toss.im/2d-emojis/png/4x/u1F622.png"
					aria-hidden={true}
					className="aspect-square"
				/>
				<Text
					display="block"
					color={adaptive.grey800}
					typography="st8"
					fontWeight="semibold"
					textAlign="center"
					className="mt-5"
				>
					풀 수 있는 퀴즈가 없어요
				</Text>
				<div className="mt-5" />
				<Button size="medium">퀴즈 알림 받을래요</Button>
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
						80명이 퀴즈를 풀고 있어요
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
									? "bg-blue-200"
									: "bg-blue-100 hover:bg-blue-200"
							}`}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-o-mono"
								color={adaptive.blue500}
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
				onClick={() => {
					if (selectedOption) {
						setIsBottomSheetOpen(true);
					}
				}}
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
						rightButton={<Button onClick={handleNextQuestion}>다음</Button>}
					/>
				}
			>
				<div className="flex justify-center items-center">
					<Asset.Icon
						frameShape={{ width: 100 }}
						name="icon-double-line-circle"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>
		</>
	);
};
