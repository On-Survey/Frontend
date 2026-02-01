import { apiCall } from "../../api/axios/apiClient";
import { resizeImage } from "../../lib/imageUtils";
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

export interface ImageUploadResponse {
	url: string;
}

/**
 * 이미지 파일을 업로드합니다.
 * POST /v1/images
 * multipart/form-data 형식으로 파일 업로드
 */
export const uploadImage = async (file: File): Promise<string> => {
	// 이미지 파일인 경우 크기에 따라 리사이징
	if (file.type.startsWith("image/")) {
		const fileSizeMB = file.size / (1024 * 1024);

		// 1MB 이상이면 리사이징
		if (fileSizeMB > 1) {
			let maxSize = 1920;
			let quality = 0.8;

			if (fileSizeMB > 5) {
				maxSize = 800;
				quality = 0.6;
			} else if (fileSizeMB > 3) {
				maxSize = 1280;
				quality = 0.7;
			} else if (fileSizeMB > 2) {
				maxSize = 1600;
				quality = 0.75;
			}
			try {
				file = await resizeImage(file, maxSize, quality);
			} catch (err) {
				console.warn("이미지 리사이징 실패:", err);
			}
		}
	}

	const formData = new FormData();
	formData.append("file", file);

	const result = await apiCall<ImageUploadResponse>({
		method: "POST",
		url: "/v1/images",
		data: formData,
	});

	return result.url;
};
