import { useSuspenseQuery } from "@tanstack/react-query";
import { getGlobalStats } from "../service/surveyList";

export const useGlobalStats = () => {
	return useSuspenseQuery({
		queryKey: ["globalStats"],
		queryFn: getGlobalStats,
	});
};
