import type { TransformedSurveyQuestion } from "@features/survey/service/surveyParticipation";
import { DateQuestion } from "./DateQuestion";
import { ImageQuestion } from "./ImageQuestion";
import { LongAnswerQuestion } from "./LongAnswerQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { NPSQuestion } from "./NPSQuestion";
import { NumberQuestion } from "./NumberQuestion";
import { RatingQuestion } from "./RatingQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { TitleQuestion } from "./TitleQuestion";

interface QuestionRendererProps {
	question: TransformedSurveyQuestion;
	answer?: string;
	onAnswerChange: (questionId: number, answer: string) => void;
	error?: boolean;
	errorMessage?: string;
	onDatePickerOpen?: () => void;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const QuestionRenderer = ({
	question,
	answer,
	onAnswerChange,
	error,
	errorMessage,
	onDatePickerOpen,
	isExpanded = true,
	onToggleExpand,
}: QuestionRendererProps) => {
	const commonProps = {
		question,
		answer,
		onAnswerChange,
		error,
		errorMessage,
		isExpanded,
		onToggleExpand,
	};

	switch (question.type) {
		case "multipleChoice":
			return <MultipleChoiceQuestion {...commonProps} />;
		case "shortAnswer":
			return <ShortAnswerQuestion {...commonProps} />;
		case "longAnswer":
			return <LongAnswerQuestion {...commonProps} />;
		case "number":
			return <NumberQuestion {...commonProps} />;
		case "date":
			return (
				<DateQuestion {...commonProps} onDatePickerOpen={onDatePickerOpen} />
			);
		case "rating":
			return <RatingQuestion {...commonProps} />;
		case "nps":
			return <NPSQuestion {...commonProps} />;
		case "image":
			return <ImageQuestion {...commonProps} />;
		case "title":
			return <TitleQuestion {...commonProps} />;
		default:
			return null;
	}
};
