import { useQuery } from "@tanstack/react-query";
import { getOngoingSurveys } from "../service/surveyList";

export const useOngoingSurveys = () => {
	return useQuery({
		queryKey: ["ongoingSurveys"],
		queryFn: () => getOngoingSurveys({ lastSurveyId: 0, size: 15 }),
	});
};
