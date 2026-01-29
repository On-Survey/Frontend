import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitScreeningResponse } from "../service/surveyParticipation";
import type { SubmitScreeningResponsePayload } from "../service/surveyParticipation/types";

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
		}) => submitScreeningResponse(screeningId, payload),
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
