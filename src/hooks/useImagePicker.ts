// 이미지 선택 기능을 제공하는 커스텀 훅
import {
	fetchAlbumPhotos,
	getOperationalEnvironment,
} from "@apps-in-toss/web-framework";
import { useCallback, useEffect, useRef, useState } from "react";
import { base64ToFile, uploadImage } from "../service/userInfo";

interface UseImagePickerOptions {
	defaultImage?: string;
	onImageUploaded?: (url: string) => Promise<void> | void;
	autoUpload?: boolean;
	originalImageUrl?: string;
}

export const useImagePicker = ({
	defaultImage,
	onImageUploaded,
	autoUpload = false,
	originalImageUrl,
}: UseImagePickerOptions = {}) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(
		defaultImage || null,
	);
	const [isUploading, setIsUploading] = useState(false);
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
				const selectedImage = images[0] as {
					uri?: string;
					base64?: string;
					id?: string;
				};
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

	const handleImageUpload = useCallback(
		async (image: string) => {
			if (!image || image === originalImageUrl) {
				return;
			}

			let imageUrl = image;

			// base64나 blob인 경우 먼저 업로드
			if (image.startsWith("data:")) {
				try {
					setIsUploading(true);
					const file = base64ToFile(image);
					imageUrl = await uploadImage(file);
				} catch (err) {
					console.error("이미지 업로드 실패:", err);
					if (originalImageUrl) {
						setSelectedImage(originalImageUrl);
					}
					setIsUploading(false);
					throw err;
				}
			} else if (image.startsWith("blob:")) {
				try {
					setIsUploading(true);
					const response = await fetch(image);
					const blob = await response.blob();
					const file = new File([blob], "image.jpg", { type: blob.type });
					imageUrl = await uploadImage(file);
				} catch (err) {
					console.error("이미지 업로드 실패:", err);
					if (originalImageUrl) {
						setSelectedImage(originalImageUrl);
					}
					setIsUploading(false);
					throw err;
				}
			}

			// 업로드 후 콜백 실행
			if (onImageUploaded) {
				try {
					await onImageUploaded(imageUrl);
					setSelectedImage(imageUrl);
				} catch (err) {
					console.error("이미지 업로드 후 처리 실패:", err);
					if (originalImageUrl) {
						setSelectedImage(originalImageUrl);
					}
					throw err;
				} finally {
					setIsUploading(false);
				}
			} else {
				setIsUploading(false);
			}

			return imageUrl;
		},
		[onImageUploaded, originalImageUrl],
	);

	// 자동 업로드가 활성화된 경우 이미지 변경 시 업로드
	useEffect(() => {
		if (
			autoUpload &&
			selectedImage &&
			selectedImage !== originalImageUrl &&
			!isUploading
		) {
			void handleImageUpload(selectedImage);
		}
	}, [
		selectedImage,
		autoUpload,
		originalImageUrl,
		isUploading,
		handleImageUpload,
	]);

	return {
		selectedImage,
		fileInputRef,
		handleImageClick,
		handleFileChange,
		setSelectedImage,
		isUploading,
		handleImageUpload,
	};
};
