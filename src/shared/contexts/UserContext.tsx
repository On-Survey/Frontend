import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { createUserResponse } from "../user";
import { getUserInfo } from "../user";

type UserContextValue = {
	userInfo: createUserResponse | null;
	fetchUserInfo: () => Promise<void>;
	isLoading: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren) => {
	const [userInfo, setUserInfo] = useState<createUserResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUserInfo = useCallback(async () => {
		try {
			setIsLoading(true);
			const userInfoResult = await getUserInfo();
			setUserInfo(userInfoResult);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUserInfo();
	}, [fetchUserInfo]);

	const value = useMemo(
		() => ({
			userInfo,
			fetchUserInfo,
			isLoading,
		}),
		[userInfo, fetchUserInfo, isLoading],
	);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserInfo = () => {
	const ctx = useContext(UserContext);
	if (!ctx) {
		throw new Error("useUserInfo must be used within a UserProvider");
	}
	return ctx;
};
