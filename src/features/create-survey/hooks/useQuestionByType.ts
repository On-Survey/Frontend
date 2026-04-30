import { useSurvey } from "@shared/contexts/SurveyContext";
import {
	type CheckboxGridQuestion,
	type DateQuestion,
	type ImageQuestion,
	isCheckboxGridQuestion,
	isDateQuestion,
	isImageQuestion,
	isLongAnswerQuestion,
	isMultipleChoiceGridQuestion,
	isMultipleChoiceQuestion,
	isNPSQuestion,
	isNumberQuestion,
	isRatingQuestion,
	isShortAnswerQuestion,
	isTimeQuestion,
	isTitleQuestion,
	type LongAnswerQuestion,
	type MultipleChoiceGridQuestion,
	type MultipleChoiceQuestion,
	type NPSQuestion,
	type NumberQuestion,
	type QuestionType,
	type RatingQuestion,
	type ShortAnswerQuestion,
	type TimeQuestion,
	type TitleQuestion,
} from "@shared/types/survey";
import { useSearchParams } from "react-router-dom";

type QuestionTypeMap = {
	date: DateQuestion;
	shortAnswer: ShortAnswerQuestion;
	longAnswer: LongAnswerQuestion;
	rating: RatingQuestion;
	nps: NPSQuestion;
	number: NumberQuestion;
	time: TimeQuestion;
	multipleChoice: MultipleChoiceQuestion;
	image: ImageQuestion;
	checkboxGrid: CheckboxGridQuestion;
	multipleChoiceGrid: MultipleChoiceGridQuestion;
	title: TitleQuestion;
};

const typeGuardMap = {
	date: isDateQuestion,
	shortAnswer: isShortAnswerQuestion,
	longAnswer: isLongAnswerQuestion,
	rating: isRatingQuestion,
	nps: isNPSQuestion,
	number: isNumberQuestion,
	time: isTimeQuestion,
	multipleChoice: isMultipleChoiceQuestion,
	image: isImageQuestion,
	checkboxGrid: isCheckboxGridQuestion,
	multipleChoiceGrid: isMultipleChoiceGridQuestion,
	title: isTitleQuestion,
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
