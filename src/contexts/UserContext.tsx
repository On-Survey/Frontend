import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { createUserResponse } from "../service/user";
import { getUserInfo } from "../service/user";

type UserContextValue = {
	userInfo: createUserResponse | null;
	fetchUserInfo: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren) => {
	const [userInfo, setUserInfo] = useState<createUserResponse | null>(null);

	const fetchUserInfo = useCallback(async () => {
		const userInfoResult = await getUserInfo();
		setUserInfo(userInfoResult);
	}, []);

	useEffect(() => {
		fetchUserInfo();
	}, [fetchUserInfo]);

	const value = useMemo(
		() => ({
			userInfo,
			fetchUserInfo,
		}),
		[userInfo, fetchUserInfo],
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
