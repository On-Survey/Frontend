import { completeSurvey } from "@features/survey/service/surveyParticipation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCompleteSurvey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ surveyId }: { surveyId: number }) =>
			completeSurvey(surveyId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["surveyInfo", variables.surveyId],
			});
			queryClient.invalidateQueries({
				queryKey: ["surveyQuestions", variables.surveyId],
			});
			// 홈 및 설문 리스트 새로고침
			queryClient.invalidateQueries({ queryKey: ["globalStats"] });
			queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] });
			queryClient.invalidateQueries({ queryKey: ["allOngoingSurveys"] });
			queryClient.invalidateQueries({ queryKey: ["recommendedSurveys"] });
			queryClient.invalidateQueries({ queryKey: ["impendingSurveys"] });
			queryClient.invalidateQueries({ queryKey: ["ongoingSurveysList"] });
		},
	});
};
