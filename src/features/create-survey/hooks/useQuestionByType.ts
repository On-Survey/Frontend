import { useSurvey } from "@shared/contexts/SurveyContext";
import {
	type DateQuestion,
	isDateQuestion,
	isLongAnswerQuestion,
	isMultipleChoiceQuestion,
	isNPSQuestion,
	isNumberQuestion,
	isRatingQuestion,
	isShortAnswerQuestion,
	type LongAnswerQuestion,
	type MultipleChoiceQuestion,
	type NPSQuestion,
	type NumberQuestion,
	type QuestionType,
	type RatingQuestion,
	type ShortAnswerQuestion,
} from "@shared/types/survey";
import { useSearchParams } from "react-router-dom";

type QuestionTypeMap = {
	date: DateQuestion;
	shortAnswer: ShortAnswerQuestion;
	longAnswer: LongAnswerQuestion;
	rating: RatingQuestion;
	nps: NPSQuestion;
	number: NumberQuestion;
	multipleChoice: MultipleChoiceQuestion;
};

const typeGuardMap = {
	date: isDateQuestion,
	shortAnswer: isShortAnswerQuestion,
	longAnswer: isLongAnswerQuestion,
	rating: isRatingQuestion,
	nps: isNPSQuestion,
	number: isNumberQuestion,
	multipleChoice: isMultipleChoiceQuestion,
} as const;

export const useQuestionByType = <T extends QuestionType>(type: T) => {
	const { state } = useSurvey();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) => q.questionId.toString() === questionIdFromUrl && q.type === type,
			)
		: questions
				.filter((q) => q.type === type)
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const typeGuard = typeGuardMap[type];
	const question = typeGuard(targetQuestion)
		? (targetQuestion as QuestionTypeMap[T])
		: undefined;

	return {
		question,
		questionId: question?.questionId.toString(),
		questionIdFromUrl,
		isRequired: question?.isRequired ?? false,
		title: question?.title,
		description: question?.description,
	};
};
