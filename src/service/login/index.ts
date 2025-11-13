import { apiClient } from "../axios/apiClient";

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export const loginApi = async (
	authorizationCode: string,
	referrer: string,
): Promise<LoginResponse> => {
	const response = await apiClient.post("/auth/toss/login", {
		authorizationCode,
		referrer,
	});

	// 헤더에서 토큰 추출
	const authorizationHeader = response.headers.authorization;
	const refreshTokenHeader = response.headers["x-refresh-token"];

	if (!authorizationHeader || !refreshTokenHeader) {
		throw new Error("토큰 추출 실패");
	}

	const accessToken = authorizationHeader.split(" ")[1];
	const refreshToken = refreshTokenHeader.split(" ")[1];

	return {
		accessToken,
		refreshToken,
	};
};
