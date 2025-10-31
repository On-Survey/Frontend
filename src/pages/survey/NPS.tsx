import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveyNPS = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
		description?: string;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [score, setScore] = useState<number | null>(null);

	useEffect(() => {
		const mock: Question = {
			id: 501,
			title: "온서베이를 지인에게 추천할 의향이 얼마나 되시나요?",
			required: true,
			description: "0 ~ 10점 중 선택",
		};
		setQuestion(mock);
	}, []);

	const isInvalid = (question?.required ?? false) && score === null;

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

			<div className="px-4 mt-20 flex-1 overflow-y-auto pb-28">
				<div className="flex gap-2.5 justify-center px-6">
					{Array.from({ length: 10 }, (_, idx) => {
						const v = idx + 1;
						const isActive = score !== null && v <= score;
						return (
							<div key={v} className="flex flex-col items-center gap-2">
								<button
									type="button"
									className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"}`}
									aria-label={`${v}점`}
									onClick={() => setScore(v)}
								/>
								<span
									className="text-[14px] font-medium"
									style={{ color: colors.grey600 }}
								>
									{v}
								</span>
							</div>
						);
					})}
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
					<CTAButton display="block" disabled={isInvalid}>
						다음
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyNPS;
