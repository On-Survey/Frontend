import { Storage } from "@apps-in-toss/web-framework";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// 액세스 토큰 가져오기
export const getAccessToken = async (): Promise<string | null> => {
	return await Storage.getItem(ACCESS_TOKEN_KEY);
};

// 리프레시 토큰 가져오기
export const getRefreshToken = async (): Promise<string | null> => {
	return await Storage.getItem(REFRESH_TOKEN_KEY);
};

// 토큰 저장
export const saveTokens = async (
	accessToken: string,
	refreshToken: string,
): Promise<void> => {
	await Storage.setItem(ACCESS_TOKEN_KEY, accessToken);
	await Storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

//토큰 삭제
export const clearTokens = async (): Promise<void> => {
	await Storage.removeItem(ACCESS_TOKEN_KEY);
	await Storage.removeItem(REFRESH_TOKEN_KEY);
};
