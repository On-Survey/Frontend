import { adaptive } from "@toss/tds-colors";
import { Asset, Spacing, Text } from "@toss/tds-mobile";

export type PreviewInconvertibleQuestionBannerProps = {
	totalFailedCount: number;
	highlightLine: string | null;
	/** 섹션 이동 바로 아래에 붙을 때 상단 여백을 조금 더 줌 */
	compactTop?: boolean;
	/** 하단 고정 CTA 위에 둘 때 하단 여백 축소 */
	compactBottom?: boolean;
	/** 미리보기: 전역 순 이전·다음 실패 문항 (없으면 화살표 비활성) */
	onHighlightPrev?: () => void;
	onHighlightNext?: () => void;
	canGoHighlightPrev?: boolean;
	canGoHighlightNext?: boolean;
};

export const PreviewInconvertibleQuestionBanner = ({
	totalFailedCount,
	highlightLine,
	compactTop = false,
	compactBottom = false,
	onHighlightPrev,
	onHighlightNext,
	canGoHighlightPrev = false,
	canGoHighlightNext = false,
}: PreviewInconvertibleQuestionBannerProps) => {
	const interactive =
		onHighlightPrev !== undefined && onHighlightNext !== undefined;

	return (
		<div
			className={`w-full  ${compactTop ? "pt-3" : "pt-1"} ${compactBottom ? "pb-0" : "pb-2"}`}
		>
			<div
				className="rounded-2xl p-4"
				style={{ backgroundColor: adaptive.red50 }}
			>
				<div className="flex items-center gap-2">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW20}
						backgroundColor="transparent"
						name="icon-siren-red400"
						aria-hidden={true}
					/>
					<Text
						display="block"
						color={adaptive.grey800}
						typography="t6"
						fontWeight="bold"
						className="min-w-0"
					>
						{totalFailedCount}개 문항이 변환에 실패했어요
					</Text>
				</div>
				{highlightLine ? (
					<>
						<Spacing size={16} />
						<div
							className="flex items-center gap-2 rounded-xl px-3 py-2.5"
							style={{ backgroundColor: adaptive.red100 }}
						>
							{interactive ? (
								<button
									type="button"
									className="flex shrink-0 touch-manipulation rounded-md p-1 disabled:opacity-30"
									disabled={!canGoHighlightPrev}
									aria-label="이전 실패 문항"
									onClick={onHighlightPrev}
								>
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW20}
										backgroundColor="transparent"
										name="icon-arrow-left-2-mono"
										color={
											canGoHighlightPrev ? adaptive.grey800 : adaptive.grey500
										}
										aria-hidden={true}
										ratio="1/1"
									/>
								</button>
							) : (
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW20}
									backgroundColor="transparent"
									name="icon-arrow-left-2-mono"
									color={adaptive.grey500}
									aria-hidden={true}
									ratio="1/1"
									className="shrink-0"
								/>
							)}
							<Text
								display="block"
								color={adaptive.red600}
								typography="t6"
								fontWeight="semibold"
								className="min-w-0 flex-1 text-center line-clamp-2"
							>
								{highlightLine}
							</Text>
							{interactive ? (
								<button
									type="button"
									className="flex shrink-0 touch-manipulation rounded-md p-1 disabled:opacity-30"
									disabled={!canGoHighlightNext}
									aria-label="다음 실패 문항"
									onClick={onHighlightNext}
								>
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW20}
										backgroundColor="transparent"
										name="icon-arrow-left-2-mono"
										color={adaptive.grey800}
										aria-hidden={true}
										ratio="1/1"
										className="scale-x-[-1]"
									/>
								</button>
							) : (
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW20}
									backgroundColor="transparent"
									name="icon-arrow-left-2-mono"
									color={adaptive.grey800}
									aria-hidden={true}
									ratio="1/1"
									className="shrink-0 scale-x-[-1]"
								/>
							)}
						</div>
					</>
				) : null}
			</div>
		</div>
	);
};
