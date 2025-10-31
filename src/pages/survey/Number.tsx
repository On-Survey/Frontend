import { colors } from "@toss/tds-colors";
import {
	CTAButton,
	FixedBottomCTA,
	ProgressBar,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveyNumber = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [value, setValue] = useState("");

	useEffect(() => {
		const mock: Question = {
			id: 601,
			title: "추석 당일, 오늘의 날씨 몇 도일까요?",
			required: true,
		};
		setQuestion(mock);
	}, []);

	const isInvalid = (question?.required ?? false) && value.trim().length === 0;

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={0.25} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{question?.title ?? ""}
					</Top.TitleParagraph>
				}
				subtitleTop={
					question?.required ? (
						<Top.SubtitleBadges
							badges={[{ text: "선택", color: "blue", variant: "weak" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>문항 설명</Top.SubtitleParagraph>
				}
			/>

			<TextField.Clearable
				variant="line"
				hasError={false}
				label="숫자형"
				labelOption="sustain"
				value={value}
				onChange={(e) => {
					const val = e.target.value;
					if (val === "" || /^\d+$/.test(val)) {
						const num = val === "" ? 0 : parseInt(val, 10);
						if (val === "" || (num >= 1 && num <= 100)) {
							setValue(val);
						}
					}
				}}
				placeholder="1부터 100까지 입력할 수 있어요"
				type="tel"
				inputMode="numeric"
			/>

			<FixedBottomCTA.Double
				leftButton={
					<CTAButton
						color="dark"
						variant="weak"
						display="block"
						onClick={() => navigate(-1)}
					>
						이전
					</CTAButton>
				}
				rightButton={
					<CTAButton display="block" disabled={isInvalid}>
						확인
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyNumber;
