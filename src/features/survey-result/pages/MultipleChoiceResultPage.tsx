import { adaptive } from "@toss/tds-colors";
import { Asset, Menu, Text, TextArea, Top, useToast } from "@toss/tds-mobile";
import {
	ArcElement,
	Chart as ChartJS,
	type ChartOptions,
	Legend,
	Tooltip,
} from "chart.js";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";

ChartJS.register(ArcElement, Tooltip, Legend);

const PIE_BASE_COLOR = "#15C67F";

/** #15C67F 기준 투명도 단계별 색상 (0.25 ~ 1) */
const getPieColors = (count: number) => {
	const step = count <= 1 ? 1 : 0.75 / (count - 1);
	return Array.from({ length: count }, (_, i) => {
		const alpha = count <= 1 ? 1 : 0.25 + step * i;
		const r = 0x15;
		const g = 0xc6;
		const b = 0x7f;
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	});
};

type GraphType = "bar" | "pie";

interface MultipleChoicePieChartProps {
	options: Array<{ label: string; count: number }>;
}

const MultipleChoicePieChart = ({ options }: MultipleChoicePieChartProps) => {
	const labels = options.map((o) => o.label);
	const data = options.map((o) => o.count);
	const backgroundColors = getPieColors(options.length);

	const chartData = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: backgroundColors,
				borderWidth: 0,
			},
		],
	};

	const chartOptions: ChartOptions<"pie"> = {
		responsive: true,
		maintainAspectRatio: true,
		aspectRatio: 1.2,
		layout: {
			padding: { bottom: 28 },
		},
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					usePointStyle: true,
					pointStyle: "circle",
					padding: 12,
					font: { weight: "bold" },
					generateLabels(chart) {
						const dataset = chart.data.datasets[0];
						if (!dataset?.data) return [];
						const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
						return (chart.data.labels ?? []).map((label, i) => {
							const value = (dataset.data as number[])[i] ?? 0;
							const pct = total > 0 ? Math.round((value / total) * 100) : 0;
							return {
								text: `${label}		${pct}%`,
								fillStyle: Array.isArray(dataset.backgroundColor)
									? dataset.backgroundColor[i]
									: PIE_BASE_COLOR,
								index: i,
								lineWidth: 0,
							};
						});
					},
				},
			},
			tooltip: {
				callbacks: {
					label(ctx) {
						const total = (ctx.dataset.data as number[]).reduce(
							(a, b) => a + b,
							0,
						);
						const value = (ctx.raw as number) ?? 0;
						const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
						return `${ctx.label}: ${ctx.raw}명 (${pct}%)`;
					},
				},
			},
		},
	};

	return <Pie data={chartData} options={chartOptions} />;
};

const getBarWidth = (count: number, maxCount: number) => {
	if (maxCount <= 0) {
		return "0%";
	}
	const ratio = (count / maxCount) * 100;
	const clamped = Math.min(Math.max(ratio, 18), 100);
	return `${clamped}%`;
};

export const MultipleChoiceResultPage = () => {
	const {
		question,
		answerMap,
		answerList,
		surveyTitle,
		surveyStatus,
		responseCount,
		totalAnswerCount,
		requiredLabel,
	} = useResultPageData();
	const { openToast } = useToast();
	const [graphType, setGraphType] = useState<GraphType>("bar");
	const [menuOpen, setMenuOpen] = useState(false);

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];

	// "기타 (직접 입력):"로 시작하는 응답들을 분리
	const otherAnswers: string[] = [];
	const regularOptions: Array<{ label: string; count: number }> = [];

	Object.entries(answerMap).forEach(([label, count]) => {
		if (label.startsWith("기타 (직접 입력):")) {
			const customValue = label.replace("기타 (직접 입력):", "").trim();
			for (let i = 0; i < count; i++) {
				otherAnswers.push(customValue);
			}
		} else {
			regularOptions.push({ label, count });
		}
	});
	if (answerList && answerList.length > 0) {
		answerList.forEach((answer) => {
			if (
				typeof answer === "string" &&
				answer.startsWith("기타 (직접 입력):")
			) {
				const customValue = answer.replace("기타 (직접 입력):", "").trim();
				otherAnswers.push(customValue);
			}
		});
	}

	// 일반 옵션들을 개수 순으로 정렬
	const options = regularOptions.sort((a, b) => b.count - a.count);

	const maxCount =
		options.length > 0 ? Math.max(...options.map((o) => o.count)) : 0;
	const totalResponses =
		totalAnswerCount ??
		Object.values(answerMap).reduce((sum, count) => sum + count, 0);

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
						{requiredLabel} / 객관식
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{totalResponses === 0 || totalResponses > responseCount
							? `${responseCount}명 응답 · 총 ${totalResponses}개 답변`
							: `${responseCount}명 응답`}
					</Top.LowerButton>
				}
			/>

			{(options.length > 0 || otherAnswers.length > 0) && (
				<div className="px-6 pt-2 pb-4">
					<Menu.Trigger
						open={menuOpen}
						onOpen={() => setMenuOpen(true)}
						onClose={() => setMenuOpen(false)}
						dropdown={
							<Menu.Dropdown>
								<Menu.DropdownItem
									onClick={() => {
										setGraphType("bar");
										setMenuOpen(false);
									}}
								>
									막대 그래프
								</Menu.DropdownItem>
								<Menu.DropdownItem
									onClick={() => {
										if (options.length >= 7) {
											openToast(
												"선택지가 7개 이상일 경우 파이 차트 가독성이 떨어질 수 있어요",
												{ type: "bottom" },
											);
										}
										setGraphType("pie");
										setMenuOpen(false);
									}}
								>
									파이 차트
								</Menu.DropdownItem>
							</Menu.Dropdown>
						}
					>
						<div className="flex items-center gap-1">
							<Text
								color={adaptive.grey700}
								typography="t5"
								fontWeight="medium"
							>
								그래프
							</Text>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-system-arrow-down-outlined"
								aria-hidden={true}
								ratio="1/1"
							/>
						</div>
					</Menu.Trigger>
				</div>
			)}

			<div className="pb-12 space-y-5">
				{options.length === 0 && otherAnswers.length === 0 ? (
					<div className="px-4 py-8 text-center">
						<p className="text-gray-500">아직 응답이 없습니다.</p>
					</div>
				) : (
					<>
						{graphType === "bar" && (
							<>
								{/* 일반 객관식 옵션들을 막대그래프로 표시 */}
								{options.map((option) => {
									const isTop = option.count === maxCount && maxCount > 0;
									const barWidth = getBarWidth(option.count, maxCount);
									return (
										<div key={option.label} className="space-y-2 px-6">
											<Text
												color={adaptive.grey900}
												typography="t5"
												fontWeight="semibold"
												className="mb-1!"
											>
												{option.label}
											</Text>
											<div
												className="h-8 rounded-[8px] shadow-sm px-4 flex items-center text-base font-semibold leading-none text-white"
												style={{
													width: barWidth,
													background: isTop
														? "linear-gradient(90deg, #00c7fc 0%, #04CB98ff 64.61094705033995%)"
														: "linear-gradient(90deg, #e5e7eb 0%, #9ca3af 64.61094705033995%)",
												}}
											>
												{option.count}명
											</div>
										</div>
									);
								})}
							</>
						)}

						{graphType === "pie" && options.length > 0 && (
							<div className="px-4">
								<MultipleChoicePieChart options={options} />
							</div>
						)}

						{/* 기타 (직접 입력) 응답들을 단답식처럼 표시 */}
						{otherAnswers.length > 0 && (
							<div className="px-4 space-y-3">
								<Text
									color={adaptive.grey900}
									typography="t5"
									fontWeight="semibold"
									className="mb-2"
								>
									기타 (직접 입력)
								</Text>
								{otherAnswers.map((answer, index) => {
									// answer 값과 index를 조합하여 고유한 key 생성
									const uniqueKey = `${answer}-${index}`;
									return (
										<TextArea
											key={uniqueKey}
											variant="box"
											hasError={false}
											labelOption="sustain"
											value={answer}
											placeholder=""
											readOnly={true}
										/>
									);
								})}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default MultipleChoiceResultPage;
