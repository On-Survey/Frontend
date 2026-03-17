export type BarOption = {
	label: string;
	count: number;
	sortKey: string;
};

type AggregateParams = {
	answerMap: Record<string, number>;
	answerList: (string | number)[];
	formatLabel: (value: string) => string;
	compareTie: (sortKeyA: string, sortKeyB: string) => number;
};

/**
 * answerMap 또는 answerList를 집계해, 응답 수 내림차순 → 동점 시 compareTie 오름차순으로 정렬된 옵션 목록을 반환
 */
export function aggregateAnswerOptions({
	answerMap,
	answerList,
	formatLabel,
	compareTie,
}: AggregateParams): {
	options: BarOption[];
	maxCount: number;
	totalResponses: number;
} {
	const countByValue: Record<string, number> = {};

	if (Object.keys(answerMap).length > 0) {
		Object.entries(answerMap).forEach(([key, count]) => {
			countByValue[key] = (countByValue[key] ?? 0) + count;
		});
	} else {
		answerList.forEach((value) => {
			const key = String(value ?? "");
			countByValue[key] = (countByValue[key] ?? 0) + 1;
		});
	}

	const options = Object.entries(countByValue)
		.map(([value, count]) => ({
			label: formatLabel(value),
			count,
			sortKey: value,
		}))
		.sort((a, b) => {
			if (b.count !== a.count) return b.count - a.count;
			return compareTie(a.sortKey, b.sortKey);
		});

	const maxCount =
		options.length > 0 ? Math.max(...options.map((o) => o.count)) : 0;
	const totalResponses = options.reduce((sum, o) => sum + o.count, 0);

	return { options, maxCount, totalResponses };
}

export function getBarWidth(count: number, maxCount: number): string {
	if (maxCount <= 0) return "0%";
	const ratio = (count / maxCount) * 100;
	const clamped = Math.min(Math.max(ratio, 18), 100);
	return `${clamped}%`;
}
