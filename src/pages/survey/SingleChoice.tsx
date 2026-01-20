import { colors } from "@toss/tds-colors";
import {
	Checkbox,
	CTAButton,
	FixedBottomCTA,
	List,
	ListRow,
	ProgressBar,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { QuestionBadge } from "../../components/QuestionBadge";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

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
	const isOtherOptionSelected =
		currentAnswer === "기타 (직접 입력)" ||
		currentAnswer?.startsWith("기타 (직접 입력): ");

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
		} else if (!isOtherOptionSelected) {
			setCustomInputValue("");
		}
	}, [currentAnswer, isOtherOptionSelected]);

	if (!currentQuestion) {
		return null;
	}

	const handleOptionSelect = (optionContent: string) => {
		const isOtherOption = optionContent === "기타 (직접 입력)";

		// 이미 선택된 항목을 다시 클릭하면 선택 해제
		if (
			currentAnswer === optionContent ||
			currentAnswer?.startsWith("기타 (직접 입력): ")
		) {
			updateAnswer(currentQuestion.questionId, "");
			setCustomInputValue("");
		} else {
			if (isOtherOption) {
				// 기타 옵션 선택 시 입력 필드 초기화
				setCustomInputValue("");
				updateAnswer(currentQuestion.questionId, "기타 (직접 입력)");
			} else {
				updateAnswer(currentQuestion.questionId, optionContent);
				setCustomInputValue("");
			}
		}
	};

	const handleCustomInputChange = (value: string) => {
		setCustomInputValue(value);
		const fullAnswer = value.trim()
			? `기타 (직접 입력): ${value}`
			: "기타 (직접 입력)";
		updateAnswer(currentQuestion.questionId, fullAnswer);
	};

	const hasAnswer = Boolean(currentAnswer);
	const isRequired = currentQuestion.isRequired ?? false;
	const hasCustomInput = currentQuestion.hasCustomInput ?? false;

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
						<List role="radiogroup">
							{currentQuestion.options.map((choice) => {
								const isOtherOption = choice.content === "기타 (직접 입력)";
								const isSelected =
									currentAnswer === choice.content ||
									(isOtherOption && isOtherOptionSelected);

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
											<Checkbox.Line checked={isSelected} aria-hidden={true} />
										}
										verticalPadding="large"
									/>
								);
							})}
						</List>
						{hasCustomInput && isOtherOptionSelected && (
							<div className="px-4 mt-4">
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
