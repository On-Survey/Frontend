import { apiCall } from "../axios/apiClient";
import type { MemberInfo } from "./types";

/**
 * 현재 로그인한 회원의 정보를 조회합니다.
 * GET /v1/members
 */
export const getMemberInfo = async (): Promise<MemberInfo> => {
	return apiCall<MemberInfo>({
		method: "GET",
		url: "/v1/members",
	});
};

/**
 * 프로필 이미지 URL을 설정합니다.
 * PATCH /v1/members/profile-image
 */
export const updateProfileImage = async (
	profileUrl: string,
): Promise<string> => {
	return apiCall<string>({
		method: "PATCH",
		url: "/v1/members/profile-image",
		data: { profileUrl },
	});
};
