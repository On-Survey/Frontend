import { adaptive } from "@toss/tds-colors";
import { Border, Text, Top } from "@toss/tds-mobile";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";

const BAR_COLORS = [
	adaptive.green300,
	adaptive.blue500,
	adaptive.orange300,
	adaptive.purple300,
	adaptive.yellow300,
	adaptive.teal400,
];
const MAX_BAR_HEIGHT = 176;

type GridAnswerMap = Record<string, Record<string, number>>;

const getHash = (value: string) => {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
};

const getColumnColor = (columnLabel: string, index: number) => {
	if (index < BAR_COLORS.length) {
		return BAR_COLORS[index];
	}

	// 기본 팔레트 이후에는 컬럼별로 고정된 HSL 색상을 생성
	const seed = getHash(`${columnLabel}-${index}`);
	const hue = seed % 360;
	const saturation = 68 + (seed % 8); // 68~75%
	const lightness = 58 + (seed % 6); // 58~63%
	return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export const GridResultPage = () => {
	const {
		question,
		gridAnswerMap,
		surveyTitle,
		surveyStatus,
		responseCount,
		requiredLabel,
	} = useResultPageData();

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];
	const normalizedGridAnswerMap = (gridAnswerMap ?? {}) as GridAnswerMap;
	const rows = Object.keys(normalizedGridAnswerMap);
	const columns = Array.from(
		new Set(
			rows.flatMap((rowLabel) =>
				Object.keys(normalizedGridAnswerMap[rowLabel]),
			),
		),
	);

	const globalMaxCount = Math.max(
		...rows.flatMap((rowLabel) =>
			columns.map(
				(columnLabel) => normalizedGridAnswerMap[rowLabel]?.[columnLabel] ?? 0,
			),
		),
		0,
	);

	return (
		<div className="min-h-screen">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{question?.title || surveyTitle}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleBadges
						badges={[
							{
								text: SURVEY_STATUS_LABELS[surveyStatus],
								color: badge.color,
								variant: "weak",
							},
						]}
					/>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						{requiredLabel} / 그리드
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{responseCount}명 응답
					</Top.LowerButton>
				}
			/>

			{rows.length === 0 || columns.length === 0 ? (
				<div className="px-4 py-8 text-center">
					<p className="text-gray-500">아직 응답이 없어요</p>
				</div>
			) : (
				<div className="px-4 pt-4 pb-12">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2">
						{columns.map((columnLabel, index) => (
							<div
								key={`legend-${columnLabel}`}
								className="inline-flex items-center gap-2 whitespace-nowrap"
							>
								<span
									className="inline-block h-4 w-4 rounded-full shrink-0"
									style={{
										backgroundColor: getColumnColor(columnLabel, index),
									}}
								/>
								<Text
									color={adaptive.grey800}
									typography="t6"
									fontWeight="semibold"
								>
									{columnLabel}
								</Text>
							</div>
						))}
					</div>

					<div
						className="mt-6 overflow-x-auto w-full"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						<style>{`.grid-result-scroll::-webkit-scrollbar { display: none }`}</style>
						<div className="grid-result-scroll flex gap-3 min-w-fit">
							{rows.map((rowLabel) => (
								<div
									key={`row-card-${rowLabel}`}
									className="w-[150px] shrink-0 rounded-[12px] bg-white p-2"
								>
									<div className="h-[230px] flex items-end justify-center gap-[8px]">
										{columns.map((columnLabel, index) => {
											const count =
												normalizedGridAnswerMap[rowLabel]?.[columnLabel] ?? 0;
											if (count <= 0) {
												return null;
											}
											const barHeight =
												globalMaxCount > 0
													? Math.max(
															(count / globalMaxCount) * MAX_BAR_HEIGHT,
															8,
														)
													: 8;
											return (
												<div
													key={`bar-${rowLabel}-${columnLabel}`}
													className="w-8 rounded-[8px] flex items-start justify-center pt-2"
													style={{
														height: `${barHeight}px`,
														backgroundColor: getColumnColor(columnLabel, index),
													}}
												>
													<Text
														color={adaptive.background}
														typography="t6"
														fontWeight="semibold"
													>
														{count}명
													</Text>
												</div>
											);
										})}
									</div>
									<Border className="my-4!" />
									<div className="w-full flex justify-center">
										<Text
											color={adaptive.grey500}
											typography="t7"
											fontWeight="medium"
										>
											{rowLabel}
										</Text>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GridResultPage;
