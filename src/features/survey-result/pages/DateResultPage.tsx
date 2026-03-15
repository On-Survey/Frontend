import { formatDateDisplay } from "@shared/lib/FormatDate";
import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";

const getBarWidth = (count: number, maxCount: number) => {
	if (maxCount <= 0) return "0%";
	const ratio = (count / maxCount) * 100;
	const clamped = Math.min(Math.max(ratio, 18), 100);
	return `${clamped}%`;
};

export const DateResultPage = () => {
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

	// answer 값들을 집계
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
			label: formatDateDisplay(value),
			count,
			sortKey: value,
		}))
		.sort((a, b) => {
			if (b.count !== a.count) return b.count - a.count;
			const timeA = new Date(a.sortKey).getTime();
			const timeB = new Date(b.sortKey).getTime();
			return timeA - timeB;
		});

	const maxCount =
		options.length > 0 ? Math.max(...options.map((o) => o.count)) : 0;
	const totalResponses = options.reduce((sum, o) => sum + o.count, 0);

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
						{requiredLabel} / 날짜형
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

			<div className="pb-12 space-y-5">
				{options.length === 0 ? (
					<div className="px-4 py-8 text-center">
						<p className="text-gray-500">아직 응답이 없어요</p>
					</div>
				) : (
					options.map((option) => {
						const isTop = option.count === maxCount && maxCount > 0;
						const barWidth = getBarWidth(option.count, maxCount);
						const pct =
							totalResponses > 0
								? Math.round((option.count / totalResponses) * 100)
								: 0;
						return (
							<div key={`date-${option.sortKey}`} className="space-y-2 px-6">
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
					})
				)}
			</div>
		</div>
	);
};

export default DateResultPage;
