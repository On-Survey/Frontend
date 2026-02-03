import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text } from "@toss/tds-mobile";

interface NPSQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const NPSQuestion = ({
	question,
	answer,
	onAnswerChange,
	error,
	errorMessage,
	isExpanded = true,
	onToggleExpand,
}: NPSQuestionProps) => {
	const selectedValue = answer ? parseInt(answer, 10) : null;

	const handleScoreChange = (value: number) => {
		onAnswerChange(question.questionId, value.toString());
	};

	const getDescriptionText = () => {
		return question.isRequired ? "필수" : "선택";
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
					<Spacing size={19} />
					<div className="px-4 flex gap-2.5">
						{Array.from({ length: 10 }, (_, idx) => {
							const value = idx + 1;
							const isActive = selectedValue !== null && value <= selectedValue;
							const isSelected = selectedValue === value;
							return (
								<Asset.Text
									key={value}
									frameShape={Asset.frameShape.CircleSmall}
									backgroundColor={
										isSelected
											? adaptive.green300
											: isActive
												? adaptive.grey200
												: adaptive.greyOpacity100
									}
									style={{
										color: isSelected
											? adaptive.grey200
											: isActive
												? adaptive.grey700
												: adaptive.grey600,
										fontSize: "11px",
										fontWeight: "bold",
									}}
									aria-label={`${value}점`}
									onClick={() => handleScoreChange(value)}
								>
									{value}
								</Asset.Text>
							);
						})}
					</div>
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
