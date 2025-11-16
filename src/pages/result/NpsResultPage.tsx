import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";
import {
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import { useResultPageData } from "../../hooks/useResultPageData";

const getBarHeight = (count: number, maxCount: number) => {
	if (maxCount <= 0) {
		return "60px";
	}
	const ratio = count / maxCount;
	const height = 72 + ratio * 140;
	return `${Math.round(height)}px`;
};

const calcNps = (scores: number[]) => {
	if (scores.length === 0) return 0;
	const promoters = scores.filter((s) => s >= 9).length;
	const detractors = scores.filter((s) => s <= 6).length;
	return ((promoters - detractors) / scores.length) * 100;
};

export const NpsResultPage = () => {
	const {
		question,
		answerList,
		surveyTitle,
		surveyStatus,
		responseCount,
		requiredLabel,
	} = useResultPageData();

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];

	// answerList에서 숫자 추출
	const scores = answerList
		.map((answer) => Number(answer))
		.filter((score) => !Number.isNaN(score) && score >= 1 && score <= 10);

	// 1~10점 분포 계산
	const scoreMap = scores.reduce<Record<number, number>>((acc, score) => {
		if (!acc[score]) {
			acc[score] = 0;
		}
		acc[score] += 1;
		return acc;
	}, {});

	const npsDistribution = Array.from({ length: 10 }, (_, index) => {
		const score = index + 1;
		const count = scoreMap[score] ?? 0;
		return { score, count, label: `${score}점` };
	});

	const maxCount = Math.max(...npsDistribution.map(({ count }) => count), 0);
	const npsScore = calcNps(scores);

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
						{requiredLabel} / NPS
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{responseCount}명 응답 · NPS {Math.round(npsScore)}점
					</Top.LowerButton>
				}
			/>

			<div className="px-6 pb-12 pt-10 flex justify-center">
				{npsDistribution.length === 0 ? (
					<div className="py-8 text-center">
						<p className="text-gray-500">아직 응답이 없습니다.</p>
					</div>
				) : (
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
												? "bg-linear-to-t from-blue-200 via-blue-400 to-blue-500"
												: "bg-linear-to-t from-gray-200 via-gray-300 to-gray-400"
										}`}
										style={{ height: getBarHeight(item.count, maxCount) }}
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
				)}
			</div>
		</div>
	);
};

export default NpsResultPage;
