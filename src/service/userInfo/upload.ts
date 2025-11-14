import { getAccessToken } from "../../utils/tokenManager";

export interface ImageUploadResponse {
	url: string;
}

/**
 * 이미지 파일을 업로드합니다.
 * POST /v1/images
 * multipart/form-data 형식으로 파일 업로드
 */
export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);

	const token = await getAccessToken();
	const headers: HeadersInit = {
		// FormData 사용 시 Content-Type은 브라우저가 자동 설정
	};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/v1/images`,
		{
			method: "POST",
			body: formData,
			headers,
			credentials: "include",
		},
	);

	if (!response.ok) {
		throw new Error("이미지 업로드에 실패했습니다.");
	}

	const data = (await response.json()) as {
		code: number;
		message: string;
		result: ImageUploadResponse;
		success: boolean;
	};

	if (!data.success || !data.result?.url) {
		throw new Error(data.message || "이미지 업로드에 실패했습니다.");
	}

	return data.result.url;
};

/**
 * Base64 문자열을 File 객체로 변환
 */
export const base64ToFile = (
	base64String: string,
	filename = "image.jpg",
): File => {
	// data:image/jpeg;base64,/9j/4AAQ... 형식에서 base64 부분 추출
	const base64Data = base64String.includes(",")
		? base64String.split(",")[1]
		: base64String;

	// Base64를 바이너리로 변환
	const byteCharacters = atob(base64Data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);

	// MIME 타입 추출
	const mimeType = base64String.match(/data:([^;]+)/)?.[1] || "image/jpeg";

	// File 객체 생성
	return new File([byteArray], filename, { type: mimeType });
};
