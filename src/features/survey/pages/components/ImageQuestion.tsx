import { SurveyImage } from "@features/survey/components/SurveyImage";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Spacing } from "@toss/tds-mobile";

interface ImageQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

/**
 * 이미지 전용 문항: 타이틀·보조설명·이미지만 표시 (객관식 아님)
 */
export const ImageQuestion = ({
	question,
	isExpanded = true,
	onToggleExpand,
}: ImageQuestionProps) => {
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
						<TextWithLinks text={question.title} variant="inline" />
					</ListHeader.TitleParagraph>
				}
				description={
					question.description ? (
						<ListHeader.DescriptionParagraph>
							<TextWithLinks text={question.description} variant="inline" />
						</ListHeader.DescriptionParagraph>
					) : undefined
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
			{isExpanded && question.imageUrl && (
				<div className="px-6 mt-2 mb-2">
					<SurveyImage
						src={question.imageUrl}
						alt={question.title}
						variant="square"
					/>
				</div>
			)}
			<Spacing size={32} />
		</>
	);
};
