import {
	getSurveyQuestions,
	type TransformedSurveyQuestion,
} from "@features/survey/service/surveyParticipation";
import { useQuery } from "@tanstack/react-query";

export interface SurveySectionQuestionsResult {
	info: TransformedSurveyQuestion[];
	sectionTitle?: string;
	sectionDescription?: string;
	currSection?: number;
	nextSection?: number;
}

export const useSurveySectionQuestions = (
	surveyId: number | null,
	section: number,
) => {
	return useQuery<SurveySectionQuestionsResult>({
		queryKey: ["surveySectionQuestions", surveyId, section],
		queryFn: () => {
			if (surveyId === null) {
				throw new Error("surveyId가 필요합니다.");
			}
			return getSurveyQuestions({ surveyId, section });
		},
		enabled: surveyId !== null,
	});
};
