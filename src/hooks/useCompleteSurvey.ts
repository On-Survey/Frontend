import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeSurvey } from "../service/surveyParticipation";

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
		},
	});
};
