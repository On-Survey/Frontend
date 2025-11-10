import { adaptive } from "@toss/tds-colors";
import { TextArea, Top } from "@toss/tds-mobile";
import { formatDateDisplay } from "../../utils/FormatDate";

const dateResponses = [
	{ id: "date-01", value: "2025-02-17" },
	{ id: "date-02", value: "2025-02-18" },
	{ id: "date-03", value: "2025-02-19" },
	{ id: "date-04", value: "2025-02-19" },
	{ id: "date-05", value: "2025-02-21" },
	{ id: "date-06", value: "2025-02-22" },
];

export const DateResultPage = () => {
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
					<Top.SubtitleParagraph size={15}>필수 / 날짜형</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{dateResponses.length}명 응답
					</Top.LowerButton>
				}
			/>

			<div className="pb-12">
				{dateResponses.map((response) => (
					<TextArea
						key={response.id}
						variant="box"
						hasError={false}
						labelOption="sustain"
						value={formatDateDisplay(response.value)}
						placeholder=""
						readOnly={true}
					/>
				))}
			</div>
		</div>
	);
};

export default DateResultPage;
