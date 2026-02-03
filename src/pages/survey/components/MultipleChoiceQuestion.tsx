import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Checkbox,
	List,
	ListHeader,
	ListRow,
	Spacing,
	Text,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

const ANSWER_SEPARATOR = "|||";
const OTHER_OPTION_PREFIX = "기타 (직접 입력)";
const OTHER_OPTION_PREFIX_WITH_COLON = "기타 (직접 입력): ";

const isOtherOption = (answer: string): boolean => {
	return answer.startsWith(OTHER_OPTION_PREFIX);
};

const extractOtherInputValue = (answer: string): string => {
	return answer.replace(OTHER_OPTION_PREFIX_WITH_COLON, "");
};

const createOtherAnswer = (value: string): string => {
	return value.trim() ? `${OTHER_OPTION_PREFIX_WITH_COLON}${value}` : "";
};

interface MultipleChoiceQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

const parseAnswers = (answer: string | undefined): string[] => {
	if (!answer) return [];
	// "기타 (직접 입력)"으로 시작하는 답변은 하나의 답변으로 처리
	if (answer.startsWith(OTHER_OPTION_PREFIX)) {
		return [answer];
	}
	// 여러 답변을 분리
	const answers = answer.split(ANSWER_SEPARATOR).filter(Boolean);
	// "기타 (직접 입력)"으로 시작하는 답변이 있으면 하나로 합침
	const otherAnswers = answers.filter((a) => a.startsWith(OTHER_OPTION_PREFIX));
	if (otherAnswers.length > 0) {
		const regularAnswers = answers.filter(
			(a) => !a.startsWith(OTHER_OPTION_PREFIX),
		);
		return [...regularAnswers, otherAnswers[0]]; // 첫 번째 기타 답변만 사용
	}
	return answers;
};

const joinAnswers = (answers: string[]): string => {
	return answers.join(ANSWER_SEPARATOR);
};

export const MultipleChoiceQuestion = ({
	question,
	answer,
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: MultipleChoiceQuestionProps) => {
	const maxChoice = question.maxChoice ?? 1;
	const isMultipleSelection = maxChoice > 1;

	const selectedAnswers = useMemo(() => parseAnswers(answer), [answer]);

	// "기타 (직접 입력)" 옵션 선택 여부 확인
	const isOtherOptionSelected = useMemo(() => {
		return selectedAnswers.some(
			(answer) =>
				answer === OTHER_OPTION_PREFIX ||
				answer.startsWith(OTHER_OPTION_PREFIX_WITH_COLON) ||
				isOtherOption(answer),
		);
	}, [selectedAnswers]);

	// "기타 (직접 입력)" 입력값 추출
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

	// 일반 옵션 필터링 (기타 옵션 제외)
	const regularOptions = useMemo(() => {
		return (question.options ?? []).filter(
			(opt) => opt.content !== OTHER_OPTION_PREFIX,
		);
	}, [question.options]);

	// hasCustomInput 확인
	const hasCustomInput =
		question.hasCustomInput === true ||
		(question.options ?? []).some(
			(option) => option.content === OTHER_OPTION_PREFIX,
		);

	const handleOptionToggle = (optionContent: string) => {
		const isSelected = selectedAnswers.some(
			(answer) =>
				answer === optionContent || answer.startsWith(`${optionContent}:`),
		);

		if (isMultipleSelection) {
			if (isSelected) {
				// 선택 해제
				const newAnswers = selectedAnswers.filter(
					(answer) =>
						answer !== optionContent && !answer.startsWith(`${optionContent}:`),
				);
				onAnswerChange(
					question.questionId,
					newAnswers.length > 0 ? joinAnswers(newAnswers) : "",
				);

				// 기타 옵션 해제 시 입력값 초기화
				if (optionContent === OTHER_OPTION_PREFIX) {
					setCustomInputValue("");
				}
			} else {
				// 선택 추가
				if (selectedAnswers.length >= maxChoice) {
					return; // 최대 선택 개수 초과
				}

				// 기타 옵션 선택 시 기존 기타 답변 제거하고 새로 추가
				if (optionContent === OTHER_OPTION_PREFIX) {
					const filteredSelected = selectedAnswers.filter(
						(answer) => !isOtherOption(answer),
					);
					const newAnswers = [...filteredSelected, OTHER_OPTION_PREFIX];
					onAnswerChange(question.questionId, joinAnswers(newAnswers));
					// 입력 필드가 즉시 표시되도록 입력값 초기화
					setCustomInputValue("");
				} else {
					// 일반 옵션 선택 시 기존 답변 유지 (기타 답변 포함)
					const newAnswers = [...selectedAnswers, optionContent];
					onAnswerChange(question.questionId, joinAnswers(newAnswers));
				}
			}
		} else {
			// 단일 선택
			if (isSelected) {
				onAnswerChange(question.questionId, "");
				if (optionContent === OTHER_OPTION_PREFIX) {
					setCustomInputValue("");
				}
			} else {
				if (optionContent === OTHER_OPTION_PREFIX) {
					onAnswerChange(question.questionId, OTHER_OPTION_PREFIX);
					// 입력 필드가 즉시 표시되도록 입력값 초기화
					setCustomInputValue("");
				} else {
					onAnswerChange(question.questionId, optionContent);
				}
			}
		}
	};

	// 기타 옵션 입력 처리
	const handleCustomInputChange = (value: string) => {
		setCustomInputValue(value);
		const fullAnswer = createOtherAnswer(value);

		if (isMultipleSelection) {
			// 중복 선택 모드: 기존 기타 답변 제거하고 새 답변 추가
			const filteredSelected = selectedAnswers.filter(
				(answer) => !isOtherOption(answer),
			);
			const newSelected = fullAnswer
				? [...filteredSelected, fullAnswer]
				: filteredSelected;
			onAnswerChange(
				question.questionId,
				newSelected.length > 0 ? joinAnswers(newSelected) : "",
			);
		} else {
			// 단일 선택 모드: 기존 일반 옵션 제거하고 기타 답변만 추가
			const filteredSelected = selectedAnswers.filter(
				(answer) => !isOtherOption(answer) && answer !== "",
			);
			if (fullAnswer) {
				// 기타 답변이 있으면 일반 옵션 제거하고 기타만
				onAnswerChange(question.questionId, fullAnswer);
			} else {
				// 기타 답변이 없으면 일반 옵션만 유지
				onAnswerChange(
					question.questionId,
					filteredSelected.length > 0 ? joinAnswers(filteredSelected) : "",
				);
			}
		}
	};

	const getDescriptionText = () => {
		const parts: string[] = [];
		parts.push(question.isRequired ? "필수" : "선택");
		if (maxChoice && maxChoice >= 1) {
			parts.push(`최대 ${maxChoice}개`);
		}
		return parts.join(" / ");
	};

	return (
		<>
			<ListHeader
				descriptionPosition="top"
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						{question.title}
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{getDescriptionText()}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<div style={{ marginRight: "20px" }}>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name={isExpanded ? "icon-arrow-up-mono" : "icon-arrow-down-mono"}
							color={adaptive.grey600}
							aria-label={isExpanded ? "접기" : "펼치기"}
							onClick={onToggleExpand}
						/>
					</div>
				}
			/>
			{question.description && (
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t6"
					fontWeight="regular"
					className="px-6! mb-2!"
				>
					{question.description}
				</Text>
			)}
			{isExpanded && (
				<>
					{regularOptions.length > 0 && (
						<List>
							{regularOptions.map((option) => {
								const isSelected = selectedAnswers.some(
									(answer) =>
										answer === option.content ||
										answer.startsWith(`${option.content}:`),
								);
								return (
									<ListRow
										key={option.optionId}
										role="checkbox"
										aria-checked={isSelected}
										contents={
											<ListRow.Texts
												type="1RowTypeA"
												top={option.content}
												topProps={{ color: adaptive.grey700 }}
											/>
										}
										right={
											<Checkbox.Line
												size={24}
												checked={isSelected}
												aria-hidden={true}
											/>
										}
										onClick={() => handleOptionToggle(option.content)}
									/>
								);
							})}
						</List>
					)}
					{hasCustomInput && (
						<div className={`px-6 ${regularOptions.length > 0 ? "mt-4" : ""}`}>
							<Text
								display="block"
								color={adaptive.grey700}
								typography="t6"
								fontWeight="semibold"
								className="mb-2!"
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
					)}
					{error && errorMessage && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="px-6! mt-2!"
						>
							{errorMessage}
						</Text>
					)}
				</>
			)}
			<Spacing size={32} />
		</>
	);
};
