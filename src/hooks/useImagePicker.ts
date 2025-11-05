// 이미지 선택 기능을 제공하는 커스텀 훅
import {
	fetchAlbumPhotos,
	getOperationalEnvironment,
} from "@apps-in-toss/web-framework";
import { useRef, useState } from "react";

export const useImagePicker = (defaultImage?: string) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(
		defaultImage || null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isWebEnvironment = () => {
		const environment = getOperationalEnvironment();
		return environment !== "sandbox" && environment !== "toss";
	};

	const handleImageClick = async () => {
		// 웹 환경에서는 file input 사용
		if (isWebEnvironment()) {
			fileInputRef.current?.click();
			return;
		}

		try {
			const images = await fetchAlbumPhotos({
				maxCount: 1,
				maxWidth: 500,
				base64: true,
			});

			if (images && images.length > 0) {
				const selectedImage = images[0] as { uri?: string; base64?: string };
				// base64가 있으면 base64 data URL 사용, 없으면 uri 사용
				if (selectedImage.base64) {
					setSelectedImage(`data:image/jpeg;base64,${selectedImage.base64}`);
				} else if (selectedImage.uri) {
					setSelectedImage(selectedImage.uri);
				}
			}
		} catch (error) {
			console.error("앨범에서 사진 선택 실패:", error);
			// 에뮬레이터/시뮬레이터에서 실패 시 웹 fallback
			if (fileInputRef.current) {
				fileInputRef.current.click();
			}
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					setSelectedImage(reader.result as string);
				}
			};
			reader.readAsDataURL(file);
		}
		// 같은 파일 다시 선택 가능하도록 초기화
		if (event.target) {
			event.target.value = "";
		}
	};

	return {
		selectedImage,
		fileInputRef,
		handleImageClick,
		handleFileChange,
		setSelectedImage,
	};
};
