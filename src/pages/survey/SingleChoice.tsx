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
import { useEffect, useMemo, useState } from "react";
import { QuestionBadge } from "../../components/QuestionBadge";
import { useSurveyNavigation } from "../../hooks/useSurveyNavigation";

const ANSWER_SEPARATOR = "|||";
const OTHER_OPTION_PREFIX = "기타 (직접 입력)";
const OTHER_OPTION_PREFIX_WITH_COLON = "기타 (직접 입력): ";

// 답변 파싱 유틸리티
const parseAnswers = (answer: string | undefined): string[] => {
	if (!answer) return [];
	if (answer.startsWith(OTHER_OPTION_PREFIX)) {
		return [answer];
	}
	return answer.split(ANSWER_SEPARATOR).filter(Boolean);
};

const joinAnswers = (answers: string[]): string => {
	return answers.join(ANSWER_SEPARATOR);
};

const isOtherOption = (answer: string): boolean => {
	return answer.startsWith(OTHER_OPTION_PREFIX);
};

const extractOtherInputValue = (answer: string): string => {
	return answer.replace(OTHER_OPTION_PREFIX_WITH_COLON, "");
};

const createOtherAnswer = (value: string): string => {
	return value.trim() ? `${OTHER_OPTION_PREFIX_WITH_COLON}${value}` : "";
};

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

	const maxChoice = currentQuestion?.maxChoice ?? 1;
	const isMultipleSelection = maxChoice > 1;

	const selectedAnswers = useMemo(
		() => parseAnswers(currentAnswer),
		[currentAnswer],
	);

	const isOtherOptionSelected = useMemo(
		() => selectedAnswers.some(isOtherOption),
		[selectedAnswers],
	);

	const otherInputValue = useMemo(() => {
		if (!isOtherOptionSelected) return "";
		const otherAnswer = selectedAnswers.find(isOtherOption);
		return otherAnswer ? extractOtherInputValue(otherAnswer) : "";
	}, [isOtherOptionSelected, selectedAnswers]);

	const [customInputValue, setCustomInputValue] =
		useState<string>(otherInputValue);

	useEffect(() => {
		setCustomInputValue(otherInputValue);
	}, [otherInputValue]);

	const regularOptions = useMemo(
		() =>
			currentQuestion?.options?.filter(
				(option) => option.content !== OTHER_OPTION_PREFIX,
			) ?? [],
		[currentQuestion?.options],
	);

	const hasCustomInput =
		currentQuestion?.hasCustomInput === true ||
		currentQuestion?.options?.some(
			(option) => option.content === OTHER_OPTION_PREFIX,
		) === true;

	if (!currentQuestion) {
		return null;
	}

	// 일반 옵션 선택/해제 처리
	const handleOptionSelect = (optionContent: string) => {
		if (isMultipleSelection) {
			handleMultipleSelection(optionContent);
		} else {
			handleSingleSelection(optionContent);
		}
	};

	const handleSingleSelection = (optionContent: string) => {
		if (currentAnswer === optionContent) {
			updateAnswer(currentQuestion.questionId, "");
		} else {
			updateAnswer(currentQuestion.questionId, optionContent);
			if (isOtherOptionSelected) {
				setCustomInputValue("");
			}
		}
	};

	const handleMultipleSelection = (optionContent: string) => {
		const isAlreadySelected = selectedAnswers.includes(optionContent);

		if (isAlreadySelected) {
			// 선택 해제
			const newSelected = selectedAnswers.filter(
				(item) => item !== optionContent,
			);
			updateAnswer(
				currentQuestion.questionId,
				newSelected.length > 0 ? joinAnswers(newSelected) : "",
			);
		} else {
			// 선택 추가
			if (selectedAnswers.length >= maxChoice) {
				return; // 최대 선택 개수 초과
			}

			// 기타 옵션 제거 후 일반 옵션 추가
			const filteredSelected = selectedAnswers.filter(
				(item) => !isOtherOption(item),
			);
			const newSelected = [...filteredSelected, optionContent];
			updateAnswer(currentQuestion.questionId, joinAnswers(newSelected));

			if (isOtherOptionSelected) {
				setCustomInputValue("");
			}
		}
	};

	// 기타 옵션 입력 처리
	const handleCustomInputChange = (value: string) => {
		setCustomInputValue(value);

		const fullAnswer = createOtherAnswer(value);

		if (isMultipleSelection) {
			// 중복 선택 모드: 기존 일반 옵션 제거하고 기타만 추가
			const filteredSelected = selectedAnswers.filter(
				(item) => !isOtherOption(item),
			);
			const newSelected = fullAnswer
				? [...filteredSelected, fullAnswer]
				: filteredSelected;
			updateAnswer(
				currentQuestion.questionId,
				newSelected.length > 0 ? joinAnswers(newSelected) : "",
			);
		} else {
			// 단일 선택 모드
			updateAnswer(currentQuestion.questionId, fullAnswer);
		}
	};

	const hasAnswer = Boolean(currentAnswer?.trim());
	const isRequired = currentQuestion.isRequired ?? false;

	const renderCustomInput = () => (
		<div className={`px-6 ${regularOptions.length > 0 ? "mt-4" : ""}`}>
			<Text
				color={colors.grey700}
				typography="t6"
				fontWeight="semibold"
				className="mb-2"
			>
				{OTHER_OPTION_PREFIX}
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
	);

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.green500} progress={progress} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{currentQuestion.title}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<QuestionBadge
						isRequired={currentQuestion.isRequired}
						maxChoice={currentQuestion.maxChoice}
					/>
				}
				subtitleBottom={
					currentQuestion.description ? (
						<Top.SubtitleParagraph size={15}>
							{currentQuestion.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className="px-2 flex-1 overflow-y-auto pb-28">
				{regularOptions.length > 0 && (
					<List role={isMultipleSelection ? "group" : "radiogroup"}>
						{regularOptions.map((choice) => {
							const isSelected = selectedAnswers.includes(choice.content);
							const isDisabled =
								isMultipleSelection &&
								!isSelected &&
								selectedAnswers.length >= maxChoice;

							return (
								<ListRow
									key={choice.optionId}
									role={isMultipleSelection ? "checkbox" : "radio"}
									aria-checked={isSelected}
									onClick={() =>
										!isDisabled && handleOptionSelect(choice.content)
									}
									contents={
										<ListRow.Texts
											type="1RowTypeA"
											top={choice.content}
											topProps={{
												color: isDisabled ? colors.grey400 : colors.grey700,
											}}
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
				)}

				{hasCustomInput && renderCustomInput()}

				{regularOptions.length === 0 && !hasCustomInput && (
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
