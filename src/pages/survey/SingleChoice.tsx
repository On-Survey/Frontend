import { colors } from "@toss/tds-colors";
import {
	Checkbox,
	CTAButton,
	FixedBottomCTA,
	List,
	ListRow,
	ProgressBar,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveySingleChoice = () => {
	type Choice = { id: number; label: string };
	type Question = {
		id: number;
		title: string;
		required: boolean;
		multiple: false;
		choices: Choice[];
		description?: string;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);

	const handleEssay = () => {
		navigate("/survey/essay");
	};

	useEffect(() => {
		const mock: Question = {
			id: 101,
			title: "추석 당일, 오늘의 날씨 예측해볼까요?",
			required: true,
			multiple: false,
			choices: [
				{ id: 1, label: "비온다" },
				{ id: 2, label: "눈온다" },
				{ id: 3, label: "물 마시기" },
			],
			description: "1개만 선택할 수 있어요",
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
				subtitleTop={
					question?.required ? (
						<Top.SubtitleBadges
							badges={[{ text: "필수문항", color: "blue", variant: "fill" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					question?.description ? (
						<Top.SubtitleParagraph size={15}>
							{question.description}
						</Top.SubtitleParagraph>
					) : undefined
				}
			/>

			<div className="px-2 flex-1 overflow-y-auto pb-28">
				<List role="radiogroup">
					{question?.choices.map((choice) => (
						<ListRow
							key={choice.id}
							role="radio"
							aria-checked={selectedChoiceId === choice.id}
							onClick={() => setSelectedChoiceId(choice.id)}
							contents={
								<ListRow.Texts
									type="1RowTypeA"
									top={choice.label}
									topProps={{ color: colors.grey700 }}
								/>
							}
							right={
								<Checkbox.Line
									checked={selectedChoiceId === choice.id}
									aria-hidden={true}
									style={{ pointerEvents: "none" }}
								/>
							}
							verticalPadding="large"
						/>
					))}
				</List>
			</div>

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
					<CTAButton display="block" onClick={handleEssay}>
						다음
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveySingleChoice;
