import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text, TextField } from "@toss/tds-mobile";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

interface DateQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	onDatePickerOpen?: () => void;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const DateQuestion = ({
	question,
	answer = "",
	error,
	errorMessage,
	onDatePickerOpen,
	isExpanded = true,
	onToggleExpand,
}: DateQuestionProps) => {
	const getDescriptionText = () => {
		return question.isRequired ? "필수" : "선택";
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
					<TextField.Button
						variant="line"
						hasError={error}
						label="날짜"
						labelOption="sustain"
						value={answer}
						placeholder="날짜를 선택해 주세요"
						right={
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								name="icon-arrow-down-mono"
								color={adaptive.grey400}
								aria-hidden={true}
							/>
						}
						onClick={onDatePickerOpen}
					/>
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
