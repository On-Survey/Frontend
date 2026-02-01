import { adaptive } from "@toss/tds-colors";
import {
	Checkbox,
	List,
	ListHeader,
	ListRow,
	Spacing,
	Text,
} from "@toss/tds-mobile";
import { useMemo } from "react";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

const ANSWER_SEPARATOR = "|||";
const OTHER_OPTION_PREFIX = "기타 (직접 입력)";

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
	if (answer.startsWith(OTHER_OPTION_PREFIX)) {
		return [answer];
	}
	return answer.split(ANSWER_SEPARATOR).filter(Boolean);
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

	const handleOptionToggle = (optionContent: string) => {
		if (isMultipleSelection) {
			const isSelected = selectedAnswers.includes(optionContent);
			let newAnswers: string[];

			if (isSelected) {
				newAnswers = selectedAnswers.filter((a) => a !== optionContent);
			} else {
				if (selectedAnswers.length >= maxChoice) {
					return; // 최대 선택 개수 초과
				}
				newAnswers = [...selectedAnswers, optionContent];
			}

			onAnswerChange(question.questionId, joinAnswers(newAnswers));
		} else {
			// 단일 선택
			onAnswerChange(
				question.questionId,
				selectedAnswers.includes(optionContent) ? "" : optionContent,
			);
		}
	};

	const getDescriptionText = () => {
		const parts: string[] = [];
		parts.push(question.isRequired ? "필수" : "선택");
		if (isMultipleSelection && maxChoice > 1) {
			parts.push(`최대 ${maxChoice}개`);
		}
		return parts.join(" / ");
	};

	return (
		<>
			<ListHeader
				size="large"
				horizontalPadding="medium"
				verticalPadding="small"
				descriptionPosition="top"
				rightAlignment="center"
				a11yRightReflow={false}
				titleWidthRatio="fill"
				title={
					<ListHeader.TitleParagraph color={adaptive.grey800}>
						{question.title}
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{getDescriptionText()}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<ListHeader.RightIconButton
						aria-label={isExpanded ? "접기" : "펼치기"}
						src={
							isExpanded
								? "https://static.toss.im/icons/png/4x/icon-system-arrow-up-outlined.png"
								: "https://static.toss.im/icons/png/4x/icon-system-arrow-down-outlined.png"
						}
						onClick={onToggleExpand}
					/>
				}
			/>
			{question.description && (
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t6"
					fontWeight="regular"
					className="px-4 mb-2"
				>
					{question.description}
				</Text>
			)}
			{isExpanded && (
				<>
					<List>
						{question.options?.map((option) => {
							const isSelected = selectedAnswers.includes(option.content);
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
					{error && errorMessage && (
						<Text
							display="block"
							color={adaptive.red500}
							typography="t7"
							fontWeight="regular"
							className="px-4 mt-2"
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
