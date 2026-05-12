import { adaptive } from "@toss/tds-colors";
import { Asset } from "@toss/tds-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SurveyImageVariant = "square" | "choice";

const VARIANT_STYLES: Record<
	SurveyImageVariant,
	{ containerClass: string; aspectRatio: string }
> = {
	square: {
		containerClass: "w-full max-w-[328px]",
		aspectRatio: "1 / 1",
	},
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

const MIN_SCALE = 1;
const MAX_SCALE = 5;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export const SurveyImage = ({
	src,
	alt = "",
	variant = "square",
	className = "",
}: SurveyImageProps) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const { containerClass, aspectRatio } = VARIANT_STYLES[variant];

	const [scale, setScale] = useState(1);
	const [isPinching, setIsPinching] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const lastTouchDistRef = useRef<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const resetZoom = useCallback(() => {
		setScale(1);
	}, []);

	const handleClose = useCallback(() => {
		setIsFullscreen(false);
		setShowHint(false);
		resetZoom();
	}, [resetZoom]);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			lastTouchDistRef.current = Math.sqrt(dx * dx + dy * dy);
			setIsPinching(true);
			setShowHint(false);
		}
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		e.preventDefault();
		if (e.touches.length === 2) {
			const ddx = e.touches[0].clientX - e.touches[1].clientX;
			const ddy = e.touches[0].clientY - e.touches[1].clientY;
			const newDist = Math.sqrt(ddx * ddx + ddy * ddy);

			if (lastTouchDistRef.current !== null) {
				const ratio = newDist / lastTouchDistRef.current;
				setScale((prev) => clamp(prev * ratio, MIN_SCALE, MAX_SCALE));
			}

			lastTouchDistRef.current = newDist;
		}
	}, []);

	const handleTouchEnd = useCallback(() => {
		lastTouchDistRef.current = null;
		setIsPinching(false);
		setScale((prev) => (prev < MIN_SCALE ? MIN_SCALE : prev));
	}, []);

	useEffect(() => {
		if (!isFullscreen) return;
		const el = containerRef.current;
		if (!el) return;
		const prevent = (e: TouchEvent) => e.preventDefault();
		el.addEventListener("touchmove", prevent, { passive: false });
		return () => el.removeEventListener("touchmove", prevent);
	}, [isFullscreen]);

	useEffect(() => {
		if (!isFullscreen) return;
		setShowHint(true);
	}, [isFullscreen]);

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
					className="absolute bottom-2 right-2 flex items-center justify-center border-0 w-11 h-11 rounded-xl! p-2 bg-[rgba(7,44,77,0.2)]"
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
						className="fixed inset-0 z-100000 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]"
						role="dialog"
						aria-modal="true"
						aria-label="이미지 전체 보기"
					>
						{/* Close button */}
						<button
							type="button"
							aria-label="전체 이미지 닫기"
							onClick={handleClose}
							className="absolute top-4 right-4 flex items-center justify-center border-0 w-11 h-11 rounded-xl! p-2"
							style={{
								backgroundColor:
									"var(--token-tds-color-grey-opacity-700, var(--adaptiveGreyOpacity700, rgba(3,18,40,0.7)))",
							}}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-x-mono"
								color="#ffffff"
								aria-hidden={true}
								ratio="1/1"
							/>
						</button>

						{/* Image area */}
						<div
							ref={containerRef}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							className="touch-none select-none overflow-hidden rounded-xl bg-[#191F28] max-w-[90vw] max-h-[75vh] w-[90vw] h-[75vh] flex items-center justify-center"
						>
							<img
								src={src}
								alt={alt}
								draggable={false}
								className="max-w-[90vw] max-h-[75vh] w-auto h-auto object-contain block rounded-xl pointer-events-none"
								style={{
									transform: `scale(${scale})`,
									transformOrigin: "center center",
									transition: isPinching ? "none" : "transform 0.15s ease-out",
									willChange: "transform",
								}}
							/>
						</div>

						{/* Hint */}
						{showHint && (
							<div className="absolute bottom-10 flex items-center gap-2 px-5 py-3 rounded-full pointer-events-none bg-[#B0B8C1]">
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW24}
									backgroundColor="transparent"
									name="icon-arrow-maximum-mono"
									color="#ffffff"
									aria-hidden={true}
									ratio="1/1"
								/>
								<span className="text-white text-sm font-medium whitespace-nowrap">
									확대하고, 손으로 움직여보세요!
								</span>
							</div>
						)}
					</div>,
					document.body,
				)}
		</>
	);
};
