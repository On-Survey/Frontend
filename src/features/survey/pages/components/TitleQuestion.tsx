import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { adaptive } from "@toss/tds-colors";
import { ListHeader, Spacing } from "@toss/tds-mobile";

interface TitleQuestionProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const TitleQuestion = ({ question }: TitleQuestionProps) => {
	return (
		<>
			<ListHeader
				descriptionPosition="bottom"
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						<TextWithLinks
							text={question.title}
							variant="inline"
							inheritLinkSize
						/>
					</ListHeader.TitleParagraph>
				}
				description={
					question.description ? (
						<ListHeader.DescriptionParagraph>
							<TextWithLinks text={question.description} variant="inline" />
						</ListHeader.DescriptionParagraph>
					) : undefined
				}
			/>
			<Spacing size={32} />
		</>
	);
};
