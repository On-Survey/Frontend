import { useQuery } from "@tanstack/react-query";
import {
	getSurveyQuestions,
	type TransformedSurveyQuestion,
} from "../service/surveyParticipation";

interface UseSurveyQuestionsOptions {
	enabled?: boolean;
}

export const useSurveyQuestions = (
	surveyId?: number,
	options?: UseSurveyQuestionsOptions,
) => {
	const { enabled = true } = options ?? {};

	return useQuery<{ info: TransformedSurveyQuestion[] }>({
		queryKey: ["surveyQuestions", surveyId],
		queryFn: () => {
			if (surveyId === undefined || surveyId === null) {
				throw new Error("surveyId가 필요합니다.");
			}
			return getSurveyQuestions({ surveyId });
		},
		enabled: Boolean(surveyId) && enabled,
	});
};
