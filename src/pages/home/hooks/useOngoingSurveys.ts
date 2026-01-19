import { useQuery } from "@tanstack/react-query";
import { getOngoingSurveys } from "../../../service/surveyList";

export const useOngoingSurveys = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["ongoingSurveys"],
		queryFn: () => getOngoingSurveys(),
		refetchOnMount: "always",
		enabled,
	});
};
