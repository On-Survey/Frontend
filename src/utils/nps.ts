export const calculateTotalResponses = (
	answerMap: Record<string, number> | undefined,
	answerList: string[] | undefined,
	responseCount: number,
): number => {
	if (answerMap && Object.keys(answerMap).length > 0) {
		return Object.values(answerMap).reduce(
			(sum, count) => sum + (Number(count) || 0),
			0,
		);
	}
	return answerList?.length || responseCount || 0;
};

export const calculateNps = (
	answerMap: Record<string, number> | undefined,
	answerList: string[] | undefined,
	totalResponses: number,
): number => {
	if (totalResponses === 0) return 0;

	let promoters = 0;
	let detractors = 0;

	if (answerMap && Object.keys(answerMap).length > 0) {
		Object.entries(answerMap).forEach(([scoreStr, count]) => {
			const score = Number(scoreStr);
			if (Number.isNaN(score)) return;
			if (score >= 1 && score <= 10) {
				if (score >= 9 && score <= 10) {
					promoters += Number(count) || 0;
				} else if (score >= 1 && score <= 6) {
					detractors += Number(count) || 0;
				}
			}
		});
	} else if (answerList && answerList.length > 0) {
		answerList.forEach((answer) => {
			const score = Number(answer);
			if (Number.isNaN(score)) return;
			if (score >= 1 && score <= 10) {
				if (score >= 9 && score <= 10) {
					promoters += 1;
				} else if (score >= 1 && score <= 6) {
					detractors += 1;
				}
			}
		});
	}

	return ((promoters - detractors) / totalResponses) * 100;
};
