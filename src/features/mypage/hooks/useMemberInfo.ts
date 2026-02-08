import { getMemberInfo } from "@shared/service/userInfo";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useMemberInfo = () => {
	return useSuspenseQuery({
		queryKey: ["memberInfo"],
		queryFn: getMemberInfo,
	});
};
