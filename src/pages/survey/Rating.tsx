import { colors } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, ProgressBar, Top } from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SurveyRating = () => {
	type Question = {
		id: number;
		title: string;
		required: boolean;
		description?: string;
		scale?: number;
		startLabel?: string;
		endLabel?: string;
	};

	const navigate = useNavigate();
	const [question, setQuestion] = useState<Question | null>(null);
	const [value, setValue] = useState<number | null>(null);

	useEffect(() => {
		const mock: Question = {
			id: 401,
			title: "이번 기능에 얼마나 만족하시나요?",
			required: true,
			description: "1 ~ 5점 중 선택",
			scale: 5,
			startLabel: "매우 아니다",
			endLabel: "매우 그렇다",
		};
		setQuestion(mock);
	}, []);

	const scale = question?.scale ?? 5;
	const items = useMemo(
		() => Array.from({ length: scale }, (_, i) => i + 1),
		[scale],
	);
	const isInvalid = (question?.required ?? false) && value === null;

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

			<div className="px-4 mt-8 flex-1 overflow-y-auto pb-28">
				<fieldset
					className="flex items-center gap-4 justify-center"
					aria-label="평가 선택"
				>
					{items.map((n) => {
						const id = `rating-${n}`;
						const isSelected = value === n;
						return (
							<label key={n} htmlFor={id} className="cursor-pointer">
								<input
									id={id}
									name="rating"
									type="radio"
									value={n}
									aria-label={`평가 ${n}점`}
									checked={isSelected}
									onChange={() => setValue(n)}
									className="sr-only peer"
									required={question?.required}
								/>
								<span
									className={
										"inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors outline-none " +
										(isSelected
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300") +
										" peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500"
									}
									aria-hidden="true"
								></span>
							</label>
						);
					})}
				</fieldset>
				<div className="flex items-center justify-between mt-4 px-4">
					<span className="text-[12px] text-gray-500">
						{question?.startLabel ?? "낮음"}
					</span>
					<span className="text-[12px] text-gray-500">
						{question?.endLabel ?? "높음"}
					</span>
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
						완료하기
					</CTAButton>
				}
			/>
		</div>
	);
};

export default SurveyRating;
