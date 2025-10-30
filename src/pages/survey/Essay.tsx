import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveyEssay = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
		description?: string;
		maxLength?: number;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [answer, setAnswer] = useState("");

	const handleShortAnswer = () => {
		navigate("/survey/shortAnswer");
	};

	useEffect(() => {
		const mock: Question = {
			id: 201,
			title: "추석 당일, 오늘의 날씨 예측해볼까요?",
			required: true,
			description: "1 ~ 500 글자 수 제한",
			maxLength: 500,
		};
		setQuestion(mock);
	}, []);

	const maxLength = question?.maxLength ?? 500;
	const isInvalid = (question?.required ?? false) && answer.trim().length === 0;

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="px-4 pt-2" />

			<div className="px-4 mt-3">
				<ProgressBar size="normal" color={colors.blue500} progress={0.25} />
			</div>

			<div className="mt-2">
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
			</div>

			<div className="px-4 mt-4 flex-1 overflow-y-auto pb-28">
				<textarea
					value={answer}
					onChange={(e) => setAnswer(e.target.value.slice(0, maxLength))}
					placeholder="내용을 입력해주세요"
					className="w-full border border-solid border-gray-200 rounded-xl p-4 text-[15px] leading-6 outline-none focus:border-blue-400 min-h-[160px]"
					aria-label="서술형 답변 입력"
				/>
				<div className="mt-2 text-right text-[12px] text-gray-500">
					{answer.length} / {maxLength}
				</div>
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
					<CTAButton
						display="block"
						disabled={isInvalid}
						onClick={handleShortAnswer}
					>
						확인
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyEssay;
