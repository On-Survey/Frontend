import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";

const npsSummary = {
	responses: 10,
	promoters: 6,
	passives: 3,
	detractors: 1,
	all: [
		{ id: "nps-01", score: 10 },
		{ id: "nps-02", score: 9 },
		{ id: "nps-03", score: 8 },
		{ id: "nps-04", score: 7 },
		{ id: "nps-05", score: 6 },
		{ id: "nps-06", score: 5 },
		{ id: "nps-07", score: 9 },
		{ id: "nps-08", score: 10 },
		{ id: "nps-09", score: 4 },
		{ id: "nps-10", score: 8 },
	],
};

const calcNps = () => {
	const { promoters, detractors, responses } = npsSummary;
	return ((promoters - detractors) / responses) * 100;
};

const scoreMap = npsSummary.all.reduce<Record<number, number>>(
	(acc, { score }) => {
		if (!acc[score]) {
			acc[score] = 0;
		}
		acc[score] += 1;
		return acc;
	},
	{},
);

const npsDistribution = Array.from({ length: 10 }, (_, index) => {
	const score = index + 1;
	const count = scoreMap[score] ?? 0;
	return { score, count, label: `${score}점` };
});

const maxCount = Math.max(...npsDistribution.map(({ count }) => count), 0);

const getBarHeight = (count: number) => {
	if (maxCount <= 0) {
		return "60px";
	}
	const ratio = count / maxCount;
	const height = 72 + ratio * 140;
	return `${Math.round(height)}px`;
};

export const NpsResultPage = () => {
	const npsScore = calcNps();

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
					<Top.SubtitleParagraph size={15}>필수 / NPS</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{npsSummary.responses}명 응답 · NPS {Math.round(npsScore)}점
					</Top.LowerButton>
				}
			/>

			<div className="px-6 pb-12 pt-10 flex justify-center">
				<div className="flex items-end gap-3 overflow-x-auto">
					{npsDistribution.map((item) => {
						const isTop = item.count === maxCount && maxCount > 0;
						return (
							<div
								key={item.score}
								className="flex flex-col items-center gap-2 pb-2"
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

export default NpsResultPage;
