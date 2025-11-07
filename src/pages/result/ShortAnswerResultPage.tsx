import { adaptive } from "@toss/tds-colors";
import { TextArea, Top } from "@toss/tds-mobile";

const shortAnswerResponses = [
	{ id: "short-01", value: "말티즈" },
	{ id: "short-02", value: "비숑 프리제" },
	{ id: "short-03", value: "포메라니안" },
	{ id: "short-04", value: "믹스견" },
	{ id: "short-05", value: "요크셔테리어" },
	{ id: "short-06", value: "골든 리트리버" },
	{ id: "short-07", value: "푸들" },
	{ id: "short-08", value: "웰시코기" },
	{ id: "short-09", value: "시바" },
	{ id: "short-10", value: "치와와" },
];

export const ShortAnswerResultPage = () => {
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
						필수 / 주관식 단답형
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{shortAnswerResponses.length}명 응답
					</Top.LowerButton>
				}
			/>

			<div className="pb-12">
				{shortAnswerResponses.map((response) => (
					<TextArea
						key={response.id}
						variant="box"
						hasError={false}
						labelOption="sustain"
						value={response.value}
						placeholder=""
						readOnly={true}
					/>
				))}
			</div>
		</div>
	);
};

export default ShortAnswerResultPage;
