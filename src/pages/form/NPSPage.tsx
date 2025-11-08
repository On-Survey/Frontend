import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, SegmentedControl, Text, Top } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";

export const NPSPage = () => {
	const { state } = useSurvey();
	const navigate = useNavigate();

	const [isRequired, setIsRequired] = useState(false);
	const [score, setScore] = useState<number | null>(null);

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const questions = state.survey.question;

	const latestNPS = questions
		.filter((q) => q.type === "nps")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestNPS?.title;
	const description = latestNPS?.description;

	const handleTitleAndDescriptionEdit = () => {
		navigate(`/createForm/nps/edit`);
	};

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
						{description || "보조설명은 이런식으로 들어갈 것 같아요"}
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handleTitleAndDescriptionEdit}
					>
						문항 제목 및 설명 수정하기
					</Top.LowerButton>
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

			<div className="flex gap-2.5 mt-20 justify-center px-6">
				{Array.from({ length: 10 }, (_, idx) => {
					const v = idx + 1;
					const isActive = score !== null && v <= score;
					return (
						<div key={v} className="flex flex-col items-center gap-2">
							<button
								type="button"
								className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"} rounded-full!`}
								aria-label={`$v점`}
								onClick={() => setScore(v)}
							></button>
							<Text
								typography="t5"
								fontWeight="medium"
								color={adaptive.grey600}
							>
								{v}
							</Text>
						</div>
					);
				})}
			</div>
			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
};
