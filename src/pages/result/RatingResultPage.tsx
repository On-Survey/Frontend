import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";

const ratingSummary = {
	responses: 10,
	average: 7.8,
	all: [
		{ id: "rating-01", score: 8 },
		{ id: "rating-02", score: 7 },
		{ id: "rating-03", score: 9 },
		{ id: "rating-04", score: 6 },
		{ id: "rating-05", score: 8 },
		{ id: "rating-06", score: 10 },
		{ id: "rating-07", score: 5 },
		{ id: "rating-08", score: 9 },
		{ id: "rating-09", score: 7 },
		{ id: "rating-10", score: 8 },
	],
};

const ratingDistribution = Object.values(
	ratingSummary.all.reduce<Record<number, { score: number; count: number }>>(
		(acc, { score }) => {
			if (!acc[score]) {
				acc[score] = { score, count: 0 };
			}
			acc[score].count += 1;
			return acc;
		},
		{},
	),
)
	.sort((a, b) => b.count - a.count || b.score - a.score)
	.map((item) => ({ ...item, label: `${item.score}점` }));

const maxCount = ratingDistribution[0]?.count ?? 0;

const getBarHeight = (count: number) => {
	if (maxCount <= 0) {
		return "0px";
	}
	const ratio = count / maxCount;
	const height = 72 + ratio * 140;
	return `${Math.round(height)}px`;
};

export const RatingResultPage = () => {
	return (
		<div className="min-h-screen">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						반려동물 외모 취향에 관한 설문
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleBadges
						badges={[{ text: "노출중", color: "blue", variant: "weak" }]}
					/>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>필수 / 평가형</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{ratingSummary.responses}명 응답 · 평균{" "}
						{ratingSummary.average.toFixed(1)}점
					</Top.LowerButton>
				}
			/>

			<div className="px-6 pb-12 flex justify-center">
				<div className="flex items-end gap-4">
					{ratingDistribution.map((item) => {
						const isTop = item.count === maxCount;
						return (
							<div
								key={item.score}
								className="flex flex-col items-center gap-2"
							>
								<Text
									color={isTop ? adaptive.blue500 : adaptive.grey600}
									typography="t6"
									fontWeight="semibold"
								>
									{item.label}
								</Text>
								<div
									className={`w-8 rounded-full shadow-sm ${
										isTop
											? "bg-gradient-to-t from-blue-200 via-blue-400 to-blue-500"
											: "bg-gradient-to-t from-gray-200 via-gray-300 to-gray-400"
									}`}
									style={{ height: getBarHeight(item.count) }}
								/>
								<Text
									color={adaptive.grey700}
									typography="t7"
									fontWeight="medium"
								>
									{item.count}명
								</Text>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default RatingResultPage;
