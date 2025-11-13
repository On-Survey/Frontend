import { adaptive } from "@toss/tds-colors";
import { TextArea, Top } from "@toss/tds-mobile";

const longAnswerResponses = [
	{
		id: "long-01",
		value:
			"강아지의 털 관리가 편하고 성격이 온순한 견종을 선호합니다. 특히 아이들과 잘 지내는 것이 중요해요.",
	},
	{
		id: "long-02",
		value:
			"최근에는 활동량이 많지 않은 반려견을 찾고 있어서 실내 생활이 가능한 소형견을 고려하고 있습니다.",
	},
	{
		id: "long-03",
		value:
			"알레르기가 있어서 빠짐없이 털 관리를 해야 하는 견종보다는 저자극 종을 고르게 돼요.",
	},
];

export const LongAnswerResultPage = () => {
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
					<Top.SubtitleParagraph size={15}>
						필수 / 주관식 서술형
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						10명 응답
					</Top.LowerButton>
				}
			/>

			{longAnswerResponses.map((response) => (
				<TextArea
					key={response.id}
					variant="box"
					hasError={false}
					labelOption="sustain"
					value={response.value}
					placeholder=""
					readOnly={true}
					rows={2}
				/>
			))}
		</div>
	);
};

export default LongAnswerResultPage;
