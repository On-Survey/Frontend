import { Top } from "@toss/tds-mobile";

interface QuestionBadgeProps {
	isRequired?: boolean;
	maxChoice?: number;
}

export const QuestionBadge = ({
	isRequired,
	maxChoice,
}: QuestionBadgeProps) => {
	const badges = [
		{
			text: isRequired ? "필수" : "선택",
			color: isRequired ? "green" : "elephant",
			variant: "fill" as const,
		},
	];

	if (maxChoice && maxChoice > 0) {
		badges.push({
			text: `최대 ${maxChoice}개`,
			color: "green",
			variant: "weak" as const,
		});
	}

	return <Top.SubtitleBadges badges={badges} />;
};
