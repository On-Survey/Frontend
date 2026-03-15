import { formatDateDisplay } from "@shared/lib/FormatDate";
import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import { BarChartResultView } from "../components/BarChartResultView";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";
import { aggregateAnswerOptions } from "../utils/aggregateAnswerOptions";

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
	const { options, maxCount, totalResponses } = aggregateAnswerOptions({
		answerMap,
		answerList,
		formatLabel: formatDateDisplay,
		compareTie: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
	});

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

			<BarChartResultView
				options={options}
				maxCount={maxCount}
				totalResponses={totalResponses}
				keyPrefix="date"
			/>
		</div>
	);
};

export default DateResultPage;
