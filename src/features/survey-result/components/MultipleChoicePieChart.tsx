import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import {
	ArcElement,
	Chart as ChartJS,
	type ChartOptions,
	Legend,
	Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PIE_OTHER_THRESHOLD_PCT = 5;

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

export interface MultipleChoicePieChartOption {
	label: string;
	count: number;
}

interface MultipleChoicePieChartProps {
	options: MultipleChoicePieChartOption[];
}

export const MultipleChoicePieChart = ({
	options,
}: MultipleChoicePieChartProps) => {
	const total = options.reduce((sum, o) => sum + o.count, 0);

	// 5% 미만 항목은 차트에서만 '기타'로 묶음
	const mainOptions = options.filter(
		(o) => total > 0 && (o.count / total) * 100 >= PIE_OTHER_THRESHOLD_PCT,
	);
	const otherOptions = options.filter(
		(o) => total > 0 && (o.count / total) * 100 < PIE_OTHER_THRESHOLD_PCT,
	);
	const otherSum = otherOptions.reduce((s, o) => s + o.count, 0);

	const chartLabels = [
		...mainOptions.map((o) => o.label),
		...(otherSum > 0 ? ["기타"] : []),
	];
	const chartDataValues = [
		...mainOptions.map((o) => o.count),
		...(otherSum > 0 ? [otherSum] : []),
	];
	const chartColors = getPieColors(chartLabels.length);

	// 범례용 색상 매핑(mainOptions, otherOptions)
	const otherSliceColorIndex = otherSum > 0 ? chartLabels.length - 1 : -1;

	const getLegendColor = (label: string) => {
		if (otherSliceColorIndex >= 0) {
			const isOther = otherOptions.some((o) => o.label === label);
			if (isOther) {
				return chartColors[otherSliceColorIndex];
			}
		}

		const mainIndex = mainOptions.findIndex((o) => o.label === label);
		if (mainIndex >= 0) {
			return chartColors[mainIndex];
		}

		return chartColors[0];
	};

	const chartData = {
		labels: chartLabels,
		datasets: [
			{
				data: chartDataValues,
				backgroundColor: chartColors,
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
			legend: { display: false },
			tooltip: {
				callbacks: {
					label(ctx) {
						const datasetTotal = (ctx.dataset.data as number[]).reduce(
							(a, b) => a + b,
							0,
						);
						const value = (ctx.raw as number) ?? 0;
						const pct =
							datasetTotal > 0
								? ((value / datasetTotal) * 100).toFixed(1)
								: "0";
						return `${ctx.label}: ${ctx.raw}명 (${pct}%)`;
					},
				},
			},
		},
	};

	return (
		<div>
			<Pie data={chartData} options={chartOptions} />
			<div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3">
				{options.map((option) => {
					const pct = total > 0 ? Math.round((option.count / total) * 100) : 0;
					const legendColor = getLegendColor(option.label);
					return (
						<div key={option.label} className="flex items-center gap-2">
							<span
								className="shrink-0 rounded-full"
								style={{
									width: 10,
									height: 10,
									backgroundColor: legendColor,
								}}
								aria-hidden
							/>
							<Text
								color={adaptive.grey900}
								typography="t6"
								fontWeight="semibold"
							>
								{option.label}
								{"	"}
								{pct}%
							</Text>
						</div>
					);
				})}
			</div>
		</div>
	);
};
