import { colors } from "@toss/tds-colors";
import {
	Checkbox,
	CTAButton,
	FixedBottomCTA,
	List,
	ListRow,
	ProgressBar,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { QuestionBadge } from "../components/QuestionBadge";
import { useSurveyNavigation } from "../hooks/useSurveyNavigation";

export const SurveySingleChoice = () => {
	const {
		currentQuestion,
		answers,
		updateAnswer,
		progress,
		totalQuestions,
		currentQuestionIndex,
		submitting,
		handlePrev,
		handleNext,
	} = useSurveyNavigation({
		questionType: "multipleChoice",
	});

	const currentAnswer = currentQuestion
		? answers[currentQuestion.questionId]
		: undefined;
	const isOtherOptionSelected = currentAnswer?.startsWith("기타 (직접 입력");

	// 기존 답변에서 입력값 추출
	const initialCustomInput =
		isOtherOptionSelected && currentAnswer?.startsWith("기타 (직접 입력): ")
			? currentAnswer.replace("기타 (직접 입력): ", "")
			: "";

	const [customInputValue, setCustomInputValue] =
		useState<string>(initialCustomInput);

	// 답변이 변경될 때 입력값 동기화
	useEffect(() => {
		if (
			isOtherOptionSelected &&
			currentAnswer?.startsWith("기타 (직접 입력): ")
		) {
			const inputValue = currentAnswer.replace("기타 (직접 입력): ", "");
			setCustomInputValue(inputValue);
		} else if (!isOtherOptionSelected && currentAnswer !== "기타 (직접 입력)") {
			setCustomInputValue("");
		}
	}, [currentAnswer, isOtherOptionSelected]);

	if (!currentQuestion) {
		return null;
	}

	const handleOptionSelect = (optionContent: string) => {
		// 이미 선택된 항목을 다시 클릭하면 선택 해제
		if (currentAnswer === optionContent) {
			updateAnswer(currentQuestion.questionId, "");
		} else {
			updateAnswer(currentQuestion.questionId, optionContent);
			// 다른 옵션 선택 시 기타 입력값 초기화
			if (isOtherOptionSelected) {
				setCustomInputValue("");
			}
		}
	};

	const handleCustomInputChange = (value: string) => {
		setCustomInputValue(value);
		// 입력값이 있으면 자동으로 답변에 반영
		const fullAnswer = value.trim() ? `기타 (직접 입력): ${value}` : "";
		if (fullAnswer) {
			updateAnswer(currentQuestion.questionId, fullAnswer);
		} else {
			// 입력값이 없으면 답변 초기화
			updateAnswer(currentQuestion.questionId, "");
		}
	};

	const hasAnswer = Boolean(currentAnswer);
	const isRequired = currentQuestion.isRequired ?? false;
	// options 배열에 "기타 (직접 입력)"이 있거나 hasCustomInput이 true이면 입력 필드 표시
	const hasCustomInput =
		currentQuestion.hasCustomInput === true ||
		currentQuestion.options?.some(
			(option) => option.content === "기타 (직접 입력)",
		) === true;

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.green500} progress={progress} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{currentQuestion?.title ?? ""}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<QuestionBadge
						isRequired={currentQuestion?.isRequired}
						maxChoice={currentQuestion?.maxChoice}
					/>
				}
				subtitleBottom={
					currentQuestion?.description ? (
						<Top.SubtitleParagraph size={15}>
							{currentQuestion.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className="px-2 flex-1 overflow-y-auto pb-28">
				{currentQuestion?.options && currentQuestion.options.length > 0 ? (
					<>
						{currentQuestion.options.filter(
							(choice) => choice.content !== "기타 (직접 입력)",
						).length > 0 && (
							<List role="radiogroup">
								{currentQuestion.options
									.filter((choice) => choice.content !== "기타 (직접 입력)")
									.map((choice) => {
										const isSelected = currentAnswer === choice.content;

										return (
											<ListRow
												key={choice.optionId}
												role="radio"
												aria-checked={isSelected}
												onClick={() => handleOptionSelect(choice.content)}
												contents={
													<ListRow.Texts
														type="1RowTypeA"
														top={choice.content}
														topProps={{ color: colors.grey700 }}
													/>
												}
												right={
													<Checkbox.Line
														checked={isSelected}
														aria-hidden={true}
													/>
												}
												verticalPadding="large"
											/>
										);
									})}
							</List>
						)}
						{hasCustomInput && (
							<div
								className={`px-6 ${currentQuestion.options.filter((choice) => choice.content !== "기타 (직접 입력)").length > 0 ? "mt-4" : ""}`}
							>
								<Text
									color={colors.grey700}
									typography="t6"
									fontWeight="semibold"
									className="mb-2"
								>
									기타 (직접 입력)
								</Text>
								<input
									type="text"
									value={customInputValue}
									onChange={(e) => handleCustomInputChange(e.target.value)}
									placeholder="내용을 입력해주세요"
									className="w-full border border-solid border-gray-200 rounded-xl px-4 py-3 text-[15px] leading-6 outline-none focus:border-green-400"
									aria-label="기타 직접 입력"
								/>
							</div>
						)}
					</>
				) : hasCustomInput ? (
					<div className="px-6">
						<Text
							color={colors.grey700}
							typography="t6"
							fontWeight="semibold"
							className="mb-2"
						>
							기타 (직접 입력)
						</Text>
						<input
							type="text"
							value={customInputValue}
							onChange={(e) => handleCustomInputChange(e.target.value)}
							placeholder="내용을 입력해주세요"
							className="w-full border border-solid border-gray-200 rounded-xl px-4 py-3 text-[15px] leading-6 outline-none focus:border-green-400"
							aria-label="기타 직접 입력"
						/>
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<p className="text-gray-500">객관식 선택지가 없어요.</p>
					</div>
				)}
			</div>

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
						onClick={handleNext}
						disabled={submitting || (isRequired && !hasAnswer)}
						loading={submitting}
						style={
							{ "--button-background-color": "#15c67f" } as React.CSSProperties
						}
					>
						{currentQuestionIndex < totalQuestions - 1 ? "다음" : "제출"}
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveySingleChoice;
