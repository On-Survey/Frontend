import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";

const multipleChoiceSummary = {
	responses: 10,
	options: [
		{ id: "opt-1", label: "포메라니안", count: 4 },
		{ id: "opt-2", label: "말티즈", count: 3 },
		{ id: "opt-3", label: "비숑 프리제", count: 2 },
		{ id: "opt-4", label: "웰시코기", count: 1 },
	],
};

const totalResponses = multipleChoiceSummary.responses;
const maxCount = Math.max(
	...multipleChoiceSummary.options.map(({ count }) => count),
);

const getBarWidth = (count: number) => {
	if (maxCount <= 0) {
		return "0%";
	}
	const ratio = (count / maxCount) * 100;
	const clamped = Math.min(Math.max(ratio, 18), 100);
	return `${clamped}%`;
};

export const MultipleChoiceResultPage = () => {
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
					<Top.SubtitleParagraph size={15}>필수 / 객관식</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
					>
						{totalResponses}명 응답
					</Top.LowerButton>
				}
			/>

			<div className="pb-12 space-y-5">
				{multipleChoiceSummary.options.map((option) => {
					const isTop = option.count === maxCount;
					return (
						<div key={option.id} className="space-y-2 px-6">
							<Text
								color={adaptive.grey900}
								typography="t5"
								fontWeight="semibold"
								className="mb-1!"
							>
								{option.label}
							</Text>
							<div
								className={`rounded-xl px-4 py-2 text-base font-semibold leading-non text-white ${
									isTop
										? "bg-gradient-to-r from-blue-300 to-blue-500 "
										: "bg-gradient-to-r from-gray-300 to-gray-400 "
								}`}
								style={{ width: getBarWidth(option.count) }}
							>
								{option.count}명
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MultipleChoiceResultPage;
