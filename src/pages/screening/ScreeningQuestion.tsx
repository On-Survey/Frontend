import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";

function ScreeningQuestion() {
	return (
		<div>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						스크리닝 질문 구성하기{" "}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						설문에 맞는 참여자를 선별할 수 있도록 OX 질문을 만들어주세요.
					</Top.SubtitleParagraph>
				}
			/>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label="질문"
				labelOption="sustain"
				help="짧고 명확한 질문일수록 효과적이에요"
				value=""
				placeholder="나는 반려동물을 키운다"
				autoFocus={true}
			/>
			<FixedBottomCTA>다음</FixedBottomCTA>
		</div>
	);
}

export default ScreeningQuestion;
