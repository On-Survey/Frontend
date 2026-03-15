import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import type { BarOption } from "../utils/aggregateAnswerOptions";
import { getBarWidth } from "../utils/aggregateAnswerOptions";

type BarChartResultViewProps = {
	options: BarOption[];
	maxCount: number;
	totalResponses: number;
	keyPrefix: string;
	emptyMessage?: string;
};

export function BarChartResultView({
	options,
	maxCount,
	totalResponses,
	keyPrefix,
	emptyMessage = "아직 응답이 없어요",
}: BarChartResultViewProps) {
	if (options.length === 0) {
		return (
			<div className="px-4 py-8 text-center">
				<p className="text-gray-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="pb-12 space-y-5">
			{options.map((option) => {
				const isTop = option.count === maxCount && maxCount > 0;
				const barWidth = getBarWidth(option.count, maxCount);
				const pct =
					totalResponses > 0
						? Math.round((option.count / totalResponses) * 100)
						: 0;
				return (
					<div
						key={`${keyPrefix}-${option.sortKey}`}
						className="space-y-2 px-6"
					>
						<Text
							color={adaptive.grey900}
							typography="t6"
							fontWeight="semibold"
							className="mb-1!"
						>
							{option.label}
						</Text>
						<div
							className="h-8 rounded-[8px] px-4 flex items-center text-base font-semibold leading-none text-white"
							style={{
								width: barWidth,
								background: isTop
									? "linear-gradient(90deg, #00c7fc 0%, #04CB98ff 64.61094705033995%)"
									: "linear-gradient(90deg, #e5e7eb 0%, #9ca3af 64.61094705033995%)",
							}}
						>
							{option.count}명({pct}%)
						</div>
					</div>
				);
			})}
		</div>
	);
}
