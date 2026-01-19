import { Top } from "@toss/tds-mobile";

interface QuestionBadgeProps {
	isRequired?: boolean;
	maxChoice?: number;
}

type BadgeConfig = {
	text: string;
	color: "blue" | "green" | "red" | "teal" | "yellow" | "elephant";
	variant: "fill" | "weak";
};

export const QuestionBadge = ({
	isRequired,
	maxChoice,
}: QuestionBadgeProps) => {
	const badges: BadgeConfig[] = [
		{
			text: isRequired ? "필수" : "선택",
			color: isRequired ? "green" : "elephant",
			variant: "fill",
		},
	];

	if (maxChoice && maxChoice > 0) {
		badges.push({
			text: `최대 ${maxChoice}개`,
			color: "green",
			variant: "weak",
		});
	}

	return <Top.SubtitleBadges badges={badges} />;
};
