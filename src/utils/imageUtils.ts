/**
 * 이미지 리사이징 유틸리티
 */
export const resizeImage = (
	file: File,
	maxSize = 1920,
	quality = 0.8,
): Promise<File> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let { width, height } = img;

				if (width > maxSize || height > maxSize) {
					if (width > height) {
						height = (height * maxSize) / width;
						width = maxSize;
					} else {
						width = (width * maxSize) / height;
						height = maxSize;
					}
				}

				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Canvas context를 가져올 수 없습니다."));
					return;
				}

				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error("이미지 변환에 실패했습니다."));
							return;
						}
						resolve(
							new File([blob], file.name, {
								type: file.type || "image/jpeg",
								lastModified: Date.now(),
							}),
						);
					},
					file.type || "image/jpeg",
					quality,
				);
			};
			img.onerror = () => reject(new Error("이미지 로드에 실패했습니다."));
			img.src = e.target?.result as string;
		};
		reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
		reader.readAsDataURL(file);
	});
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

	// MIME 타입 추출
	const mimeType = base64String.match(/data:([^;]+)/)?.[1] || "image/jpeg";

	// Base64를 바이너리로 변환
	const byteCharacters = atob(base64Data);
	const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));

	// File 객체 생성
	return new File([byteArray], filename, { type: mimeType });
};
