import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";
import {
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import { useResultPageData } from "../../hooks/useResultPageData";

const getBarWidth = (count: number, maxCount: number) => {
	if (maxCount <= 0) {
		return "0%";
	}
	const ratio = (count / maxCount) * 100;
	const clamped = Math.min(Math.max(ratio, 18), 100);
	return `${clamped}%`;
};

export const MultipleChoiceResultPage = () => {
	const {
		question,
		answerMap,
		surveyTitle,
		surveyStatus,
		responseCount,
		requiredLabel,
	} = useResultPageData();

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];

	// answerMap을 배열로 변환하고 개수 순으로 정렬
	const options = Object.entries(answerMap)
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count);

	const maxCount =
		options.length > 0 ? Math.max(...options.map((o) => o.count)) : 0;
	const totalResponses = Object.values(answerMap).reduce(
		(sum, count) => sum + count,
		0,
	);

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
						{requiredLabel} / 객관식
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{totalResponses || responseCount}명 응답
					</Top.LowerButton>
				}
			/>

			<div className="pb-12 space-y-5">
				{options.length === 0 && totalResponses === 0 ? (
					<div className="px-4 py-8 text-center">
						<p className="text-gray-500">아직 응답이 없습니다.</p>
					</div>
				) : (
					options.map((option) => {
						const isTop = option.count === maxCount && maxCount > 0;
						return (
							<div key={option.label} className="space-y-2 px-6">
								<Text
									color={adaptive.grey900}
									typography="t5"
									fontWeight="semibold"
									className="mb-1!"
								>
									{option.label}
								</Text>
								<div
									className={`rounded-xl px-4 py-2 text-base font-semibold leading-non text-white ${
										isTop
											? "bg-linear-to-r from-green-300 to-green-500 "
											: "bg-linear-to-r from-gray-300 to-gray-400 "
									}`}
									style={{ width: getBarWidth(option.count, maxCount) }}
								>
									{option.count}명
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default MultipleChoiceResultPage;
