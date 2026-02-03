import { adaptive } from "@toss/tds-colors";
import { TextArea, Top } from "@toss/tds-mobile";
import { SURVEY_BADGE_CONFIG, SURVEY_STATUS_LABELS } from "../constants/survey";
import { useResultPageData } from "../hooks/useResultPageData";

export const ShortAnswerResultPage = () => {
	const {
		question,
		answerList,
		surveyTitle,
		surveyStatus,
		responseCount,
		requiredLabel,
	} = useResultPageData();

	const badge = SURVEY_BADGE_CONFIG[surveyStatus];

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
						{requiredLabel} / 주관식 단답형
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

			<div className="pb-12">
				{answerList.length === 0 ? (
					<div className="px-4 py-8 text-center">
						<p className="text-gray-500">아직 응답이 없습니다.</p>
					</div>
				) : (
					answerList.map((value) => (
						<TextArea
							key={`short-${value}`}
							variant="box"
							hasError={false}
							labelOption="sustain"
							value={value}
							placeholder=""
							readOnly={true}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default ShortAnswerResultPage;
