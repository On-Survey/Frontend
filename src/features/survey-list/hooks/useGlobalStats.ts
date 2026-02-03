import { useQuery } from "@tanstack/react-query";
import { getGlobalStats } from "../service/surveyList";

export const useGlobalStats = () => {
	return useQuery({
		queryKey: ["globalStats"],
		queryFn: getGlobalStats,
	});
};
