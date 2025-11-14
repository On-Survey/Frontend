// 이미지 선택 기능을 제공하는 커스텀 훅
import {
	FetchAlbumPhotosPermissionError,
	fetchAlbumPhotos,
	getOperationalEnvironment,
	type ImageResponse,
} from "@apps-in-toss/web-framework";
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadImage } from "../service/userInfo";
import { base64ToFile } from "../utils/imageUtils";

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
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
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
			// 권한이 이미 허용되어 있으면 바로 사진 보관함으로 이동
			const images = await fetchAlbumPhotos({
				maxCount: 1,
				maxWidth: 1024,
				base64: true,
			});

			if (images && images.length > 0) {
				const selectedImage = images[0] as ImageResponse;
				// base64 형식으로 반환된 이미지를 표시하려면 데이터 URL 스키마 Prefix를 붙여야해요.
				const imageUri = `data:image/jpeg;base64,${selectedImage.dataUri}`;
				setSelectedImage(imageUri);
			}
		} catch (error) {
			// 권한 에러인 경우 권한 다이얼로그 표시
			if (error instanceof FetchAlbumPhotosPermissionError) {
				try {
					const permission = await fetchAlbumPhotos.openPermissionDialog();
					if (permission === "allowed") {
						// 권한이 허용되었으면 다시 시도
						const images = await fetchAlbumPhotos({
							maxCount: 1,
							maxWidth: 1024,
							base64: true,
						});
						if (images && images.length > 0) {
							const selectedImage = images[0] as ImageResponse;
							const imageUri = `data:image/jpeg;base64,${selectedImage.dataUri}`;
							setSelectedImage(imageUri);
						}
						return;
					}
				} catch (dialogError) {
					console.error("권한 다이얼로그 표시 실패:", dialogError);
				}
			}

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
			if (!image || image === originalImageUrl || image === uploadedImageUrl) {
				return;
			}

			setIsUploading(true);
			try {
				let imageUrl = image;

				// base64나 blob인 경우 먼저 업로드
				if (image.startsWith("data:")) {
					const file = base64ToFile(image);
					// base64 인코딩 오버헤드로 인해 파일 크기가 1MB를 넘을 수 있으므로
					// uploadImage에서 파일 크기를 체크하여 리사이징 수행
					imageUrl = await uploadImage(file);
				} else if (image.startsWith("blob:")) {
					const response = await fetch(image);
					const blob = await response.blob();
					const file = new File([blob], "image.jpg", { type: blob.type });
					imageUrl = await uploadImage(file);
				}

				// 업로드 완료 표시
				setUploadedImageUrl(imageUrl);

				// 업로드 후 콜백 실행
				if (onImageUploaded) {
					await onImageUploaded(imageUrl);
				}

				// 업로드된 URL로 이미지 상태 업데이트
				setSelectedImage(imageUrl);
				return imageUrl;
			} catch (err) {
				console.error("이미지 업로드 실패:", err);
				if (originalImageUrl) {
					setSelectedImage(originalImageUrl);
				}
				throw err;
			} finally {
				setIsUploading(false);
			}
		},
		[onImageUploaded, originalImageUrl, uploadedImageUrl],
	);

	// 자동 업로드가 활성화된 경우 이미지 변경 시 업로드
	useEffect(() => {
		if (
			autoUpload &&
			selectedImage &&
			selectedImage !== originalImageUrl &&
			selectedImage !== uploadedImageUrl &&
			!isUploading
		) {
			void handleImageUpload(selectedImage);
		}
	}, [
		selectedImage,
		autoUpload,
		originalImageUrl,
		uploadedImageUrl,
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
