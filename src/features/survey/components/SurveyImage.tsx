import { adaptive } from "@toss/tds-colors";
import { Asset } from "@toss/tds-mobile";
import { useState } from "react";
import { createPortal } from "react-dom";

export type SurveyImageVariant = "square" | "choice";

const VARIANT_STYLES: Record<
	SurveyImageVariant,
	{ containerClass: string; aspectRatio: string }
> = {
	// 1:1
	square: {
		containerClass: "w-full max-w-[328px]",
		aspectRatio: "1 / 1",
	},
	// 1:2
	choice: {
		containerClass: "w-full max-w-[327.5px]",
		aspectRatio: "327.5 / 160",
	},
};

interface SurveyImageProps {
	src: string;
	alt?: string;
	variant?: SurveyImageVariant;
	className?: string;
}

const EXPAND_BUTTON_STYLE = {
	width: 44,
	height: 44,
	backgroundColor: "#072C4D33",
	borderRadius: 12,
	padding: 8,
} as const;

const CLOSE_BUTTON_STYLE = {
	width: 44,
	height: 44,
	backgroundColor:
		"var(--token-tds-color-white, var(--adaptiveBackground, #ffffff))",
	borderRadius: 12,
	padding: 8,
} as const;

export const SurveyImage = ({
	src,
	alt = "",
	variant = "square",
	className = "",
}: SurveyImageProps) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const { containerClass, aspectRatio } = VARIANT_STYLES[variant];

	return (
		<>
			<div
				className={`relative inline-block ${containerClass} ${className}`}
				style={{ aspectRatio }}
			>
				<img
					src={src}
					alt={alt}
					className="w-full h-full object-cover rounded-2xl"
				/>
				<button
					type="button"
					aria-label="이미지 크게 보기"
					onClick={() => setIsFullscreen(true)}
					className="absolute bottom-2 right-2 flex items-center justify-center border-0"
					style={EXPAND_BUTTON_STYLE}
				>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-arrow-maximum-mono"
						color={adaptive.grey600}
						aria-hidden={true}
						ratio="1/1"
					/>
				</button>
			</div>

			{isFullscreen &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed inset-0 z-9999 flex flex-col items-center justify-center p-4"
						role="dialog"
						aria-modal="true"
						aria-label="이미지 전체 보기"
					>
						<button
							type="button"
							aria-label="닫기"
							className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
							onClick={() => setIsFullscreen(false)}
						/>
						<div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[90vw]">
							<img
								src={src}
								alt={alt}
								className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-2xl shadow-lg"
							/>
							<button
								type="button"
								aria-label="전체 이미지 닫기"
								onClick={() => setIsFullscreen(false)}
								className="flex items-center justify-center border-0 shrink-0 rounded-full"
								style={CLOSE_BUTTON_STYLE}
							>
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW24}
									backgroundColor="transparent"
									name="icon-x-mono"
									color={adaptive.grey600}
									aria-hidden={true}
									ratio="1/1"
								/>
							</button>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
};
