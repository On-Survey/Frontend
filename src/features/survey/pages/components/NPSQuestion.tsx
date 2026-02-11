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
		// 같은 값을 다시 클릭하면 선택 해제
		if (selectedValue === value) {
			onAnswerChange(question.questionId, "");
		} else {
			onAnswerChange(question.questionId, value.toString());
		}
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
					<div className="px-6">
						<div
							className="overflow-x-auto -mx-6 px-6 [&::-webkit-scrollbar]:hidden"
							style={
								{
									scrollbarWidth: "none",
									msOverflowStyle: "none",
								} as React.CSSProperties
							}
						>
							<div className="flex justify-center gap-3 min-w-fit">
								{Array.from({ length: 10 }, (_, idx) => {
									const value = idx + 1;
									const isActive =
										selectedValue !== null && value <= selectedValue;
									return (
										<button
											key={value}
											type="button"
											aria-label={`${value}점`}
											onClick={() => handleScoreChange(value)}
											className="cursor-pointer border-none bg-transparent p-0 transition-transform active:scale-95 flex-shrink-0"
										>
											<Asset.Text
												frameShape={Asset.frameShape.CircleSmall}
												backgroundColor={
													isActive ? adaptive.green300 : adaptive.greyOpacity100
												}
												style={{
													color: isActive ? adaptive.grey200 : adaptive.grey600,
													fontSize: "11px",
													fontWeight: "bold",
												}}
												aria-hidden
											>
												{value}
											</Asset.Text>
										</button>
									);
								})}
							</div>
						</div>
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
