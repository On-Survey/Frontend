import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing, Text } from "@toss/tds-mobile";
import { useMemo } from "react";
import type { TransformedSurveyQuestion } from "../../../service/surveyParticipation";

interface RatingQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
}

export const RatingQuestion = ({
	question,
	answer,
	onAnswerChange,
	error,
	errorMessage,
}: RatingQuestionProps) => {
	const minValue = parseInt(question.minValue ?? "1", 10);
	const maxValue = parseInt(question.maxValue ?? "10", 10);
	const selectedValue = answer ? parseInt(answer, 10) : null;

	const handleScoreChange = (value: number) => {
		onAnswerChange(question.questionId, value.toString());
	};

	const getDescriptionText = () => {
		return question.isRequired ? "필수" : "선택";
	};

	const isExpanded = true; // TODO: 접기/펼치기 상태 관리

	const ratingOptions = useMemo(() => {
		return Array.from({ length: maxValue - minValue + 1 }, (_, idx) => {
			const value = minValue + idx;
			return value;
		});
	}, [minValue, maxValue]);

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
					<Spacing size={19} />
					<div className="px-4 flex gap-2.5">
						{ratingOptions.map((value) => {
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
