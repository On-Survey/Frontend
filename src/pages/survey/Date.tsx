import { colors } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	ProgressBar,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";

export const SurveyDate = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
	};

	const [question, setQuestion] = useState<Question | null>(null);
	const [date, setDate] = useState<Date | undefined>(undefined);

	useEffect(() => {
		const mock: Question = {
			id: 701,
			title: "추석 당일, 오늘의 날씨 몇 도일까요?",
			required: true,
		};
		setQuestion(mock);
	}, []);

	return (
		<div className="flex flex-col w-full h-screen">
			<ProgressBar size="normal" color={colors.blue500} progress={0.5} />

			<Top
				title={
					<Top.TitleParagraph size={22} color={colors.grey900}>
						{question?.title ?? ""}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>문항 설명</Top.SubtitleParagraph>
				}
			/>

			<WheelDatePicker
				title="날짜를 선택해 주세요"
				value={date}
				onChange={(date) => setDate(date)}
				triggerLabel="날짜"
				buttonText="선택하기"
			/>

			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
};

export default SurveyDate;
