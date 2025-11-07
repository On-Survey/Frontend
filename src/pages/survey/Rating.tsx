import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveyRating = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [score, setScore] = useState<number | null>(null);

	useEffect(() => {
		const mock: Question = {
			id: 401,
			title: "이번 기능에 얼마나 만족하시나요?",
			required: true,
		};
		setQuestion(mock);
	}, []);

	const isInvalid = (question?.required ?? false) && score === null;

	const handleNext = () => {
		navigate("/survey/nps");
	};
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
							badges={[{ text: "필수문항", color: "blue", variant: "fill" }]}
						/>
					) : undefined
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						1 ~ 5점 중 선택
					</Top.SubtitleParagraph>
				}
			/>

			<div className="px-4 mt-20 flex-1 overflow-y-auto pb-28">
				<div className="flex gap-2.5 justify-center px-6">
					{Array.from({ length: 5 }, (_, idx) => {
						const v = idx + 1;
						const isActive = score === v;
						return (
							<div key={v} className="flex flex-col items-center gap-2">
								<button
									type="button"
									className={`w-8 h-8 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"}`}
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
				<div className="flex items-center justify-between mt-4 px-12">
					<span className="text-[12px] text-gray-500">매우 아니다</span>
					<span className="text-[12px] text-gray-500">매우 그렇다</span>
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
					<CTAButton display="block" disabled={isInvalid} onClick={handleNext}>
						다음
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyRating;
