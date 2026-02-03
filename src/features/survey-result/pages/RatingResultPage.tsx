import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";

export const RatingResultPage = () => {
	const {
		question,
		answerMap,
		answerList,
		surveyTitle,
		surveyStatus,
		responseCount,
		requiredLabel,
	} = useResultPageData();

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];
	const ratingCount = question?.rate ?? 10;

	const scores =
		answerMap && Object.keys(answerMap).length > 0
			? Object.entries(answerMap)
					.flatMap(([score, count]) => Array(count).fill(Number(score)))
					.filter(
						(score) =>
							!Number.isNaN(score) && score >= 1 && score <= ratingCount,
					)
			: answerList
					.map((answer) => Number(answer))
					.filter(
						(score) =>
							!Number.isNaN(score) && score >= 1 && score <= ratingCount,
					);

	const ratingDistribution = Array.from({ length: ratingCount }, (_, idx) => {
		const score = idx + 1;
		const count =
			answerMap && Object.keys(answerMap).length > 0
				? Number(answerMap[String(score)] || 0)
				: scores.filter((s) => s === score).length;
		return { score, count, label: `${score}점` };
	});

	const maxCount = Math.max(...ratingDistribution.map((r) => r.count), 0);
	const average =
		scores.length > 0
			? scores.reduce((sum, score) => sum + score, 0) / scores.length
			: 0;

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
						{requiredLabel} / 평가형
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{responseCount}명 응답 · 평균 {average.toFixed(1)}점
					</Top.LowerButton>
				}
			/>

			<div className="px-6 pb-12">
				<div className="flex flex-col gap-3">
					{ratingDistribution.map((item) => {
						const isTop = item.count === maxCount && maxCount > 0;
						const barWidth =
							maxCount > 0 ? Math.max((item.count / maxCount) * 100, 0) : 0;
						const minWidth = 4;
						const finalWidth = barWidth > 0 ? `${barWidth}%` : `${minWidth}px`;

						return (
							<div key={item.score} className="flex items-center gap-4">
								<Text
									color={isTop ? adaptive.green500 : adaptive.grey600}
									typography="t6"
									fontWeight="semibold"
									className="w-12"
								>
									{item.label}
								</Text>
								<div className="flex-1 flex items-center gap-2">
									<div
										className="h-8 rounded-[8px] shadow-sm"
										style={{
											width: finalWidth,
											background: isTop
												? "linear-gradient(90deg, #00c7fc 0%, #04CB98ff 64.61094705033995%)"
												: "linear-gradient(90deg, #e5e7eb 0%, #9ca3af 64.61094705033995%)",
										}}
									/>
									<Text
										color={adaptive.grey700}
										typography="t7"
										fontWeight="medium"
										className="text-right"
									>
										{item.count}명
									</Text>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default RatingResultPage;
