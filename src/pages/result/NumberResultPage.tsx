import { adaptive } from "@toss/tds-colors";
import { TextArea, Top } from "@toss/tds-mobile";

const numberResponses = [
	{ id: "num-01", value: 12 },
	{ id: "num-02", value: 8 },
	{ id: "num-03", value: 10 },
	{ id: "num-04", value: 7 },
	{ id: "num-05", value: 15 },
	{ id: "num-06", value: 11 },
	{ id: "num-07", value: 9 },
	{ id: "num-08", value: 13 },
	{ id: "num-09", value: 10 },
	{ id: "num-10", value: 8 },
	{ id: "num-11", value: 14 },
];

export const NumberResultPage = () => {
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
					<Top.SubtitleParagraph size={15}>필수 / 숫자형</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{numberResponses.length}명 응답
					</Top.LowerButton>
				}
			/>

			<div className="pb-12">
				{numberResponses.map((response) => (
					<TextArea
						key={response.id}
						variant="box"
						hasError={false}
						labelOption="sustain"
						value={`${response.value}`}
						placeholder=""
						readOnly={true}
					/>
				))}
			</div>
		</div>
	);
};

export default NumberResultPage;
