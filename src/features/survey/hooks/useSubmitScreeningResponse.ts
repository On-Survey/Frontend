import { submitScreeningResponse } from "@features/survey/service/surveyParticipation";
import type { SubmitScreeningResponsePayload } from "@features/survey/service/surveyParticipation/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubmitScreeningResponse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			screeningId,
			payload,
		}: {
			screeningId: number;
			payload: SubmitScreeningResponsePayload;
			surveyId?: number | null;
			isCorrect?: boolean;
		}) => submitScreeningResponse(screeningId, payload),
		onSuccess: async (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["surveyInfo", variables.surveyId],
			});
			queryClient.invalidateQueries({
				queryKey: ["surveyQuestions", variables.surveyId],
			});

			if (variables.isCorrect) {
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["allOngoingSurveys"] }),
					queryClient.invalidateQueries({ queryKey: ["screenings"] }),
					queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] }),
					queryClient.invalidateQueries({ queryKey: ["recommendedSurveys"] }),
					queryClient.invalidateQueries({ queryKey: ["impendingSurveys"] }),
					queryClient.invalidateQueries({ queryKey: ["ongoingSurveysList"] }),
				]);
			}
		},
	});
};
