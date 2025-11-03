import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	SegmentedControl,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useSurvey } from "../../contexts/SurveyContext";

function RatingPage() {
	const { state } = useSurvey();

	const [isRequired, setIsRequired] = useState(false);
	const [score, setScore] = useState<number | null>(null);

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const handlePlusClick = () => {
		if (score === null) {
			setScore(1);
		} else {
			setScore(score + 1);
		}
	};

	const handleMinusClick = () => {
		if (score === null) {
			setScore(1);
		} else {
			setScore(score - 1);
		}
	};

	const questions = state.survey.question;

	const latestRating = questions
		.filter((q) => q.type === "rating")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestRating?.title;

	return (
		<div>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{title}
					</Top.TitleParagraph>
				}
				subtitleTop={<Top.SubtitleBadges badges={[]} />}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						문항 설명(선택)
					</Top.SubtitleParagraph>
				}
			/>
			<SegmentedControl
				alignment="fixed"
				value={isRequired ? "1-선택" : "0-필수"}
				disabled={false}
				size="large"
				name="SegmentedControl"
				onChange={(v) => handleRequiredChange(v === "1-선택")}
			>
				<SegmentedControl.Item value="0-필수">필수</SegmentedControl.Item>
				<SegmentedControl.Item value="1-선택">선택</SegmentedControl.Item>
			</SegmentedControl>

			<div className="flex gap-1 mt-20 justify-center px-6">
				<div className="flex flex-col items-center gap-2">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-minus-circle-mono"
						color={adaptive.grey400}
						aria-hidden={true}
						ratio="1/1"
						onClick={handleMinusClick}
					/>
					<Text typography="t5" fontWeight="medium" color={adaptive.grey400}>
						10
					</Text>
				</div>
				{Array.from({ length: 10 }, (_, idx) => {
					const v = idx + 1;
					const isActive = score !== null && v <= score;
					return (
						<button
							type="button"
							key={v}
							className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"} rounded-full!`}
							aria-label={`$v점`}
							onClick={() => setScore(v)}
						></button>
					);
				})}
				<div className="flex flex-col items-center gap-2">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-plus-circle-mono"
						color={adaptive.grey400}
						aria-hidden={true}
						ratio="1/1"
						onClick={handlePlusClick}
					/>
					<Text typography="t5" fontWeight="medium" color={adaptive.grey400}>
						10
					</Text>
				</div>
			</div>
			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
}

export default RatingPage;
